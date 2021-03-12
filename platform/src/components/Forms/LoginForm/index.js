import React from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import translations from 'translations/i18next';
import { Button } from 'ui-boom-components';
import { emailValidationRegexp } from 'utils/validations';
import { LoginFormInput, LoginFormLabel } from './styles';
import { ErrorLabel } from './styles';

const UsernameValidationSchema = Yup.string()
  .trim()
  .required(translations.t('forms.required'))
  .matches(emailValidationRegexp, translations.t('forms.invalidEmail'));

const DefaultValidationSchema = Yup.object().shape({
  username: UsernameValidationSchema,
  password: Yup.string().trim().required(translations.t('forms.required')),
});

const BusinessOwnerValidationSchema = Yup.object().shape({
  username: UsernameValidationSchema,
  orderCode: Yup.string().trim().required(translations.t('forms.required')),
});

const getInitialValues = (boLogin) => {
  const initialValues = { username: '' };

  return !boLogin ? { ...initialValues, password: '' } : { ...initialValues, orderCode: '' };
};

const LoginForm = ({ boLogin, onLoginSubmit, onBoLoginSubmit }) => {
  const { t } = useTranslation();

  return (
    <Formik
      enableReinitialize
      initialValues={getInitialValues(boLogin)}
      validationSchema={boLogin ? BusinessOwnerValidationSchema : DefaultValidationSchema}
      onSubmit={async (values, actions) => {
        if (boLogin) {
          const { username, orderCode } = values;
          await onBoLoginSubmit(username, orderCode);
        } else {
          const { username, password } = values;
          await onLoginSubmit(username, password);
        }

        actions.setSubmitting(false);
      }}
    >
      {(props) => (
        <Form style={{ marginTop: 20, marginRight: 20, width: '90%' }}>
          <Field name="username">
            {({ field, meta }) => (
              <>
                <LoginFormLabel htmlFor={field.name}>{t('login.email')}</LoginFormLabel>
                <LoginFormInput type="text" id={field.name} placeholder={t('login.insertEmail')} {...field} />
                <ErrorLabel data-testid="username-error" visible={meta.error && meta.touched}>
                  {meta.error}
                </ErrorLabel>
              </>
            )}
          </Field>
          {!boLogin ? (
            <Field name="password">
              {({ field, meta }) => (
                <>
                  <LoginFormLabel htmlFor={field.name} style={{ display: 'block', marginTop: 8 }}>
                    {t('login.password')}
                  </LoginFormLabel>
                  <LoginFormInput id={field.name} type="password" placeholder={t('login.insertPassword')} {...field} />
                  <ErrorLabel data-testid="password-error" visible={meta.error && meta.touched}>
                    {meta.error}
                  </ErrorLabel>
                </>
              )}
            </Field>
          ) : (
            <Field name="orderCode">
              {({ field, meta }) => (
                <>
                  <LoginFormLabel htmlFor={field.name} style={{ display: 'block', marginTop: 8 }}>
                    {t('login.orderCode')} *
                  </LoginFormLabel>
                  <LoginFormInput id={field.name} placeholder={t('login.insertOrderCode')} {...field} />
                  <ErrorLabel data-testid="order-code-error" visible={meta.error && meta.touched}>
                    {meta.error}
                  </ErrorLabel>
                </>
              )}
            </Field>
          )}
          <Button
            backgroundColor="#cc0033"
            type="submit"
            disabled={props.isSubmitting}
            style={{ height: 40, width: '50%', marginTop: 10, borderRadius: 0 }}
          >
            <span className="circular-black-label" style={{ letterSpacing: 1, fontSize: 15, color: 'white' }}>
              {t('login.login').toUpperCase()}
            </span>
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export { LoginForm };
