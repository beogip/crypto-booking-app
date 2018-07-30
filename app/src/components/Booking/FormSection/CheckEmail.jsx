import React from 'react';
import $ from 'jquery'

class CheckEmail extends React.Component {
  componentDidMount() {
    $('#checkEmail').modal('show')
  }

  render() {
    const {offerSignature, contract, paymentAmount} = this.props
    return (
      <div className="modal" id="checkEmail" tabIndex="-2" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Please, check your email</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <i className="mdi mdi-close"/>
              </button>
            </div>
            <div className="modal-body">
              <p className="mb-1">We sent the payment instructions to your email address.</p>
              <h5 className="mb-1">Make sure you see this ETH address in the email from us!</h5>
              <h5 className="mb-1">Please, send {paymentAmount} Eth to {contract}, with this data:</h5>
              <p className="badge badge-info w-100">
                <input className="h4 lead w-100 text-white bg-transparent border-0" value={offerSignature} readOnly/>
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">Ok</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default CheckEmail;
