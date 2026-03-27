import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import List "mo:core/List";

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

  // Custom type for loan application status
  type LoanApplication = {
    trackingNumber : Nat;
    profile : Profile;
    loanOfferId : Nat;
    status : Text; // submitted, reviewed, approved, rejected
  };
  module LoanApplication {
    public func compare(app1 : LoanApplication, app2 : LoanApplication) : Order.Order {
      Nat.compare(app1.trackingNumber, app2.trackingNumber);
    };
  };

  var nextTrackingNumber = 1;
  let loanOffers = Map.empty<Nat, LoanOffer>();
  let loanApplications = Map.empty<Nat, LoanApplication>();

  // Add sample loan offers at initialization
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

  public query ({ caller }) func getLoanOffers() : async [LoanOffer] {
    loanOffers.values().toArray();
  };

  public shared ({ caller }) func submitLoanApplication(profile : Profile, loanOfferId : Nat) : async Nat {
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

  public query ({ caller }) func getApplicationStatus(trackingNumber : Nat) : async Text {
    switch (loanApplications.get(trackingNumber)) {
      case (null) { Runtime.trap("Application not found") };
      case (?app) { app.status };
    };
  };

  public query ({ caller }) func getLoanApplication(trackingNumber : Nat) : async LoanApplication {
    switch (loanApplications.get(trackingNumber)) {
      case (null) { Runtime.trap("Application not found") };
      case (?app) { app };
    };
  };

  public query ({ caller }) func getAllLoanApplications() : async [LoanApplication] {
    loanApplications.values().toArray().sort();
  };
};
