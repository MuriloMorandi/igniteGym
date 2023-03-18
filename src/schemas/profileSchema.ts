import * as yup from 'yup';

export const profileSchema = yup.object({
  name: yup.string()
    .required('Informe o nome'),
  password: yup.string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => !!value ? value : null),
  old_password: yup.string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere.'),

})