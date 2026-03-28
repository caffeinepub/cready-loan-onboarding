import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Outcall "./http-outcalls/outcall";

actor {
  type Profile = {
    name : Text;
    mobile : Text;
    pan : Text;
    dob : Text;
    email : Text;
    pincode : Text;
    address : Text;
  };

  type LoanOffer = {
    id : Nat;
    name : Text;
    interestRate : Float;
    description : Text;
    loanAmount : Nat;
    loanDurationMonths : Nat;
  };

  type LoanApplication = {
    trackingNumber : Nat;
    profile : Profile;
    loanOfferId : Nat;
    status : Text;
  };
  module LoanApplication {
    public func compare(app1 : LoanApplication, app2 : LoanApplication) : Order.Order {
      Nat.compare(app1.trackingNumber, app2.trackingNumber);
    };
  };

  // Rates stored as Nat (₹ per gram, whole numbers)
  type GoldRates = {
    city : Text;
    rate22K : Nat;
    rate24K : Nat;
    rate18K : Nat;
    lastUpdated : Int;
    isLive : Bool;
  };

  var nextTrackingNumber = 1;
  let loanOffers = Map.empty<Nat, LoanOffer>();
  let loanApplications = Map.empty<Nat, LoanApplication>();
  let goldRatesCache = Map.empty<Text, GoldRates>();

  let initialLoanOffers = [
    {
      id = 1;
      name = "Personal Loan";
      interestRate = 8.5;
      description = "Flexible personal loan up to 1 crore";
      loanAmount = 1000000;
      loanDurationMonths = 24;
    },
    {
      id = 2;
      name = "Home Loan";
      interestRate = 6.9;
      description = "Competitive rates for your dream home";
      loanAmount = 5000000;
      loanDurationMonths = 120;
    },
  ];

  for (offer in initialLoanOffers.values()) {
    loanOffers.add(offer.id, offer);
  };

  func fallbackRates(city : Text) : GoldRates {
    let (r24, r22, r18) : (Nat, Nat, Nat) = switch (city) {
      case "Mumbai"    { (14809, 13575, 11107) };
      case "Delhi"     { (14573, 13358, 10930) };
      case "Chennai"   { (14652, 13431, 10989) };
      case "Bengaluru" { (14558, 13345, 10919) };
      case "Hyderabad" { (14558, 13345, 10919) };
      case "Kolkata"   { (14558, 13345, 10919) };
      case "Pune"      { (14562, 13350, 10922) };
      case "Ahmedabad" { (14565, 13352, 10924) };
      case _           { (14558, 13345, 10919) };
    };
    { city; rate22K = r22; rate24K = r24; rate18K = r18;
      lastUpdated = Time.now(); isLive = false };
  };

  // Parse a leading unsigned integer from text (stops at first non-digit).
  func parseLeadingNat(t : Text) : ?Nat {
    var result : Nat = 0;
    var found = false;
    var done = false;
    for (c in t.chars()) {
      if (not done) {
        if (c >= '0' and c <= '9') {
          result := result * 10 + (c.toNat32() - 48).toNat();
          found := true;
        } else if (found) {
          done := true;
        };
      };
    };
    if (found) ?result else null;
  };

  // Extract the first integer value following a JSON key, e.g. "22K": 13575
  func extractJsonNat(json : Text, key : Text) : ?Nat {
    let searchKey = "\"" # key # "\"";
    var parts = json.split(#text searchKey);
    switch (parts.next()) {
      case null { null };
      case (?_) {
        switch (parts.next()) {
          case null { null };
          case (?afterKey) { parseLeadingNat(afterKey) };
        };
      };
    };
  };

  // Upsert into mutable Map: remove existing key then re-add.
  func cacheSet(city : Text, rates : GoldRates) {
    goldRatesCache.remove(city);
    goldRatesCache.add(city, rates);
  };

  public query func transform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    { input.response with headers = [] };
  };

  public func getGoldRates(city : Text) : async GoldRates {
    let url = "https://gold-silver-live-price-india.p.rapidapi.com/gold_price_india_city_value/?city=" # city;
    let headers : [Outcall.Header] = [
      { name = "x-rapidapi-key";  value = "547e59a0c9msh94218b69b03c6d0p13afcejsn056dd1d013c0" },
      { name = "x-rapidapi-host"; value = "gold-silver-live-price-india.p.rapidapi.com" },
    ];
    try {
      let responseText = await Outcall.httpGetRequest(url, headers, transform);
      let n22 = extractJsonNat(responseText, "22K");
      let n24 = extractJsonNat(responseText, "24K");
      let n18 = extractJsonNat(responseText, "18K");
      switch (n22, n24) {
        case (?v22, ?v24) {
          let rates : GoldRates = {
            city;
            rate22K = v22;
            rate24K = v24;
            rate18K = switch (n18) { case (?v) v; case null v22 * 3 / 4 };
            lastUpdated = Time.now();
            isLive = true;
          };
          cacheSet(city, rates);
          rates;
        };
        case _ {
          switch (goldRatesCache.get(city)) {
            case (?cached) cached;
            case null fallbackRates(city);
          };
        };
      };
    } catch _ {
      switch (goldRatesCache.get(city)) {
        case (?cached) cached;
        case null fallbackRates(city);
      };
    };
  };

  public query func getLoanOffers() : async [LoanOffer] {
    loanOffers.values().toArray();
  };

  public shared func submitLoanApplication(profile : Profile, loanOfferId : Nat) : async Nat {
    if (not loanOffers.containsKey(loanOfferId)) {
      Runtime.trap("Invalid loan offer ID");
    };
    let application : LoanApplication = {
      trackingNumber = nextTrackingNumber;
      profile;
      loanOfferId;
      status = "submitted";
    };
    loanApplications.add(nextTrackingNumber, application);
    let currentTrackingNumber = nextTrackingNumber;
    nextTrackingNumber += 1;
    currentTrackingNumber;
  };

  public query func getApplicationStatus(trackingNumber : Nat) : async Text {
    switch (loanApplications.get(trackingNumber)) {
      case (null) { Runtime.trap("Application not found") };
      case (?app) { app.status };
    };
  };

  public query func getLoanApplication(trackingNumber : Nat) : async LoanApplication {
    switch (loanApplications.get(trackingNumber)) {
      case (null) { Runtime.trap("Application not found") };
      case (?app) { app };
    };
  };

  public query func getAllLoanApplications() : async [LoanApplication] {
    loanApplications.values().toArray().sort();
  };
};
