import * as yup from "yup"

export const editProfileSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .matches(
      /^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/,
      "Each word must start with a capital letter and contain only letters and only one space allowed btw words no space is allowed in the beginning and end of name",
    ),
  newPassword: yup
    .string()
    .trim()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S+$/,
      "Password must contain at least one letter, one number, one special character, and no spaces",
    )
    .min(6, "Password must have at least 6 characters"),
  confirmPassword: yup
    .string()
    .trim()
    .when("newPassword", {
      is: (newPassword) => !!newPassword,
      then: (schema) =>
        schema
          .required("Confirm password is required")
          .oneOf([yup.ref("newPassword")], "Password must be same"),
      otherwise: (schema) => schema.notRequired(),
    }),
  currentPassword: yup
    .string()
    .trim()
    .when("newPassword", {
      is: (newPassword) => !!newPassword,
      then: (schema) =>
        schema
          .required("Current password is required")
          .notOneOf(
            [yup.ref("newPassword")],
            "Current password and new password must be different",
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
})
