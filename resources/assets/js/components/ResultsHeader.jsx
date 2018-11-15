import React, { Component } from 'react';

const Header = (props) => {
    const { title, subtitle } = props;
    return <div className="row" style={{ padding: '1.5rem 0' }}>
    <header className="col align-self-center">
        <h3 style={{marginBottom: 0}}>
        { title }
        &nbsp;
        <br className="d-block d-sm-none" />
        <small className="text-muted">{ subtitle }</small>
        </h3>
    </header>
    <div className="col-3 col-sm-1 align-self-center">
        <img src="/img/logo-efc.svg" alt="EFC" className="img-fluid" style={{maxWidth: 84}} />
    </div>
</div>
};

export default Header;
