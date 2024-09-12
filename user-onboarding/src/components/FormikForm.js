import React, { useState, useEffect } from 'react';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import '../App.css';

const Personform = ({ values, errors, touched, status }) => {
  const [person, setPerson] = useState([]);
  useEffect(() => {
    console.log('Status has changed', status);
    status && setPerson(person => [...person, status]);
  }, [status]);
  return (
    <div>
      <Form className='personForm'>
        <label htmlFor='name'>Name:</label>
        <Field id='name' type='text' name='name' />
        {touched.name && errors.name && <p className='err'>{errors.name}</p>}
        <label htmlFor='email'>Email:</label>
        <Field id='email' type='email' name='email' />
        {touched.email && errors.email && <p className='err'>{errors.email}</p>}
        <label htmlFor='Password'>Password:</label>
        <Field id='password' type='password' name='password' />
        {touched.password && errors.password && (
          <p className='err'>{errors.password}</p>
        )}
        <label htmlFor='terms'>
          Terms of Service
          <Field id='terms' type='checkbox' name='terms' />
          <span className='check' />
        </label>
        <button type='submit'>Sign Up</button>
      </Form>
      {person.map(p => (
        <ul key={p.id}>
          <li>Name: {p.name}</li>
          <li>Email: {p.email}</li>
          <li>Password: {p.password}</li>
        </ul>
      ))}
    </div>
  );
};

const FormikForm = withFormik({
  mapPropsToValues({ name, email, password }) {
    return {
      name: name || '',
      email: email || '',
      password: password || ''
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .max(30, 'Must be shorter than 30 characters')
      .required('Must enter a name'),
    email: Yup.string()
      .email('Must be a valid email address')
      .max(40, 'Must be shorter than 40 characters')
      .required('Must enter an email'),
    password: Yup.string()
      .required('Must enter a password')
      .max(30, 'Must be shorter than 30 characters')
  }),
  handleSubmit(values, { setStatus, resetForm }) {
    console.log('Submitting', values);
    axios
      .post('https://reqres.in/api/users', values)
      .then(res => {
        console.log('Yay', res);
        setStatus(res.data);
        resetForm();
      })
      .catch(err => {
        console.log(err.response);
      });
  }
})(Personform);

export default FormikForm;
