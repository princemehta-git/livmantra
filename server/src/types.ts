export type GuestUser = {
  name: string;
  email: string;
  phone: string;
};

export type TestSubmission = {
  user: GuestUser;
  testType: string; // "VPK"
  answers: number[]; // length 36, values 1|2|3
};


