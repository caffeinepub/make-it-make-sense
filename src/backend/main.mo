import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module SentenceRecord {
    public type Data = {
      timestamp : Int;
      sentence : Text;
    };

    public func compareByTimestamp(a : Data, b : Data) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  public type ReflectionType = {
    #dailyRationalization;
    #weeklyConsistencyCheck;
  };

  public type OnboardingAnswers = {
    whatMattersMost : Text;
    timeSpentInstead : Text;
    explanation : Text;
    uncomfortableTruth : Text;
  };

  public type UserState = {
    onboardingAnswers : ?OnboardingAnswers;
    lastDailyReflectionTime : ?Int;
    lastWeeklyReflectionTime : ?Int;
    sentenceHistory : [SentenceRecord.Data];
  };

  module UserState {
    public func empty() : UserState {
      {
        onboardingAnswers = null;
        lastDailyReflectionTime = null;
        lastWeeklyReflectionTime = null;
        sentenceHistory = [];
      };
    };
  };

  public type UserProfile = {
    name : Text;
  };

  let globalUserStates = Map.empty<Principal, UserState>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let sentenceRetentionLimit = 20;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  func getOrCreateUserState(user : Principal) : UserState {
    switch (globalUserStates.get(user)) {
      case (null) { UserState.empty() };
      case (?state) { state };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func initializeOnboarding(answers : OnboardingAnswers) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can initialize onboarding.");
    };

    switch (getOrCreateUserState(caller).onboardingAnswers) {
      case (?_) { Runtime.trap("Onboarding already completed.") };
      case (null) {
        let newState : UserState = {
          onboardingAnswers = ?answers;
          lastDailyReflectionTime = null;
          lastWeeklyReflectionTime = null;
          sentenceHistory = [];
        };
        globalUserStates.add(caller, newState);
      };
    };
  };

  public shared ({ caller }) func logDailyReflection(sentence : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can log reflections.");
    };

    let currentState = getOrCreateUserState(caller);
    let newRecord : SentenceRecord.Data = {
      timestamp = Time.now();
      sentence;
    };

    let currentHistory = List.fromArray<SentenceRecord.Data>(currentState.sentenceHistory.sliceToArray(0, sentenceRetentionLimit));
    currentHistory.add(newRecord);

    let newState : UserState = {
      currentState with
      lastDailyReflectionTime = ?Time.now();
      sentenceHistory = currentHistory.toArray();
    };

    globalUserStates.add(caller, newState);
  };

  public query ({ caller }) func getOnboardingStatus() : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can check onboarding status.");
    };

    switch (getOrCreateUserState(caller).onboardingAnswers) {
      case (null) { false };
      case (_) { true };
    };
  };

  public query ({ caller }) func getReflectionState() : async {
    dailyReflectionDue : Bool;
    weeklyReflectionDue : Bool;
  } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can check reflection state.");
    };

    let currentState = getOrCreateUserState(caller);
    let dailyDue = switch (currentState.lastDailyReflectionTime) {
      case (null) { true };
      case (?timestamp) { Time.now() - timestamp > 86400000000000 };
    };

    let weeklyDue = switch (currentState.lastWeeklyReflectionTime) {
      case (null) { true };
      case (?timestamp) { Time.now() - timestamp > 604800000000000 };
    };

    {
      dailyReflectionDue = dailyDue;
      weeklyReflectionDue = weeklyDue;
    };
  };

  public shared ({ caller }) func logWeeklyReflection() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can log weekly reflections.");
    };

    let currentState = getOrCreateUserState(caller);
    let newState : UserState = {
      currentState with
      lastWeeklyReflectionTime = ?Time.now();
    };
    globalUserStates.add(caller, newState);
  };

  public query ({ caller }) func getSentenceHistory() : async [SentenceRecord.Data] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access sentence history.");
    };

    let currentState = getOrCreateUserState(caller);
    currentState.sentenceHistory.sort(SentenceRecord.compareByTimestamp);
  };

  public query ({ caller }) func getOnboardingAnswers() : async ?OnboardingAnswers {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access onboarding answers.");
    };

    let currentState = getOrCreateUserState(caller);
    currentState.onboardingAnswers;
  };

  public shared ({ caller }) func updateOnboardingAnswers(answers : OnboardingAnswers) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update onboarding answers.");
    };

    let currentState = getOrCreateUserState(caller);
    let newState : UserState = {
      currentState with onboardingAnswers = ?answers;
    };
    globalUserStates.add(caller, newState);
  };

  public query ({ caller }) func getSentenceRetentionLimit() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access retention limits.");
    };

    sentenceRetentionLimit;
  };
};
