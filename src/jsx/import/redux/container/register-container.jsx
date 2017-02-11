/**
 * register-container.jsx: redux store for general page settings, login, and
 *                         logout processes.
 *
 * Note: this script implements jsx (reactjs) syntax.
 *
 * Note: importing 'named export' (multiple export statements in a module),
 *       requires the object being imported, to be surrounded by { brackets }.
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import RegisterForm from '../../content/register.jsx';
import setPageState from '../action/page-action.jsx';

// transforms redux state tree to react properties
const mapStateToProps = (state) => {
    return {
        user: state,
        page: {
            layout: state.page.layout
        }
    }
}

// wraps each function of the object to be dispatch callable
const mapDispatchToProps = (dispatch) => {
    return {
        dispatchPage: dispatch.bind(setPageState)
    }
}

// pass selected properties from redux state tree to component
const RegisterState = connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterForm)

// indicate which class can be exported, and instantiated via 'require'
export default RegisterState