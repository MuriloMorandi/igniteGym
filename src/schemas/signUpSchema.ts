import * as yup from 'yup';

export const signUpSchema = yup.object({
    name: yup.string()
        .required('Informe o nome.'),
    email: yup.string()
        .required('Informe o e-mail')
        .email('E-mail inválido.'),
    password: yup.string()
        .required('Informe a senha')
        .min(6, 'A senha deve ter pelo menos 6 dígitos.')
        .transform((value) => !!value ? value : null),
    rePassword: yup.string()
        .required('Confirme a senha.')
        .oneOf([yup.ref('password')], 'A confirmação da senha não confere')
        .when('password', {
		    is: (Field: any) => Field,
		    then: (schema) =>
                schema.nullable()
                    .required('Informe a confirmação da senha.')
                    .transform((value) => !!value ? value : null),
        }),
    
});