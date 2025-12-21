export type GuestUser = {
  name: string;
  email: string;
  phone: string;
};

export type TestSubmission = {
  user: GuestUser;
  testType: string; // "VPK"
  answers: number[]; // length 35, values 1|2|3|4 (Section C questions may have 4 options)
};


