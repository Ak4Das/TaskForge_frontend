import * as yup from "yup"

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Please enter your email")
    .test(
      "is-lowercase",
      "Email must be in lowercase",
      (value) => value === value?.toLowerCase(),
    ),
  password: yup
    .string()
    .trim()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S+$/,
      "Password must contain at least one letter, one number, one special character, and no spaces",
    )
    .required("Please enter your password")
    .min(6, "Password must have at least 6 characters"),
})
