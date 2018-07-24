/* eslint-env mocha */
require('dotenv').config({ path: './test/utils/.env' });
const { expect } = require('chai');
require('../../src/models');
const mongoose = require('mongoose');

const BookingModel = mongoose.model('Booking');
const { Booking } = require('../../src/controllers/Booking');
const { utils } = require('web3');
const { validBooking, validBookingDB } = require('../utils/test-data');
after(() => {
  mongoose.connection.close();
});

describe('Booking controller', () => {
  afterEach(async function () {
    await BookingModel.remove({}).exec();
  });

  it('Should create a valid booking', async function () {
    validBooking.guestEthAddress = `0xe91036d59eAd8b654eE2F5b354245f6D7eD2487e${Date.now()}`;
    const {booking, signedOffer } = await Booking.create(validBooking);
    expect(booking).to.be.an.instanceof(Booking);
    expect(booking).to.have.property('id');
    expect(booking).to.have.property('publicKey', validBooking.publicKey);
    expect(booking).to.have.property('guestEthAddress', validBooking.guestEthAddress);
    expect(booking).to.have.property('paymentAmount');
    expect(booking).to.have.property('paymentType', validBooking.paymentType);
    expect(booking).to.have.property('signatureTimestamp');
    expect(booking.signatureTimestamp).to.have.a('number');
    expect(booking).to.have.property('personalInfo');
    expect(booking.personalInfo).to.have.property('name', validBooking.personalInfo.name);
    expect(booking.personalInfo).to.have.property('email', validBooking.personalInfo.email);
    expect(booking.personalInfo).to.have.property('birthday', validBooking.personalInfo.birthday);
    expect(booking.personalInfo).to.have.property('phone', validBooking.personalInfo.phone);
    expect(booking).to.have.property('roomType', validBooking.roomType);
    expect(booking).to.have.property('to', validBooking.to);
    expect(booking).to.have.property('from', validBooking.from);
  });

  it('Should throw an error on creating an invalid booking', async () => {
    validBooking.guestEthAddress = `0xe91036d59eAd8b654eE2F5b354245f6D7eD2487e${Date.now()}`;
    try {
      await Booking.create(Object.assign({}, validBooking, { roomType: -1 }));
      throw Error('should not be called');
    } catch (e) {
      expect(e.code).to.be.equal('#invalidPaymentAmount');
    }
  });

  it('Should throw an error on creating an invalid booking', async () => {
    validBooking.guestEthAddress = `0xe91036d59eAd8b654eE2F5b354245f6D7eD2487e${Date.now()}`;
    try {
      await Booking.create(Object.assign({}, validBooking, { to: 0 }));
      throw Error('should not be called');
    } catch (e) {
      expect(e.code).to.be.equal('#toOutOfRange');
    }
  });

  it('Should store the personalInfo encoded', async () => {
    validBooking.guestEthAddress = `0xe91036d59eAd8b654eE2F5b354245f6D7eD2487e${Date.now()}`;
    const {booking} = await Booking.create(validBooking);
    const dbBooking = await BookingModel.findById(booking.id).exec();
    expect(dbBooking).to.be.an('object');
    expect(utils.isHex(dbBooking.personalInfo)).to.be.equal(true);
  });
  it('Should read a booking', async () => {
    validBooking.guestEthAddress = validBookingDB.guestEthAddress = `0xe91036d59eAd8b654eE2F5b354245f6D7eD2487e${Date.now()}`;
    const dbBooking = new BookingModel(validBookingDB);
    await dbBooking.save();
    const booking = await Booking.read({ id: dbBooking._id });
    expect(booking).to.be.an.instanceof(Booking);
    expect(booking).to.have.property('id');
    expect(booking).to.have.property('publicKey', validBooking.publicKey);
    expect(booking).to.have.property('guestEthAddress', validBooking.guestEthAddress);
    expect(booking).to.have.property('paymentAmount', validBooking.paymentAmount);
    expect(booking).to.have.property('paymentType', validBooking.paymentType);
    expect(booking).to.have.property('signatureTimestamp');
    expect(booking.signatureTimestamp).to.have.a('number');
    expect(booking).to.have.property('personalInfo');
    expect(booking.personalInfo).to.have.property('name', validBooking.personalInfo.name);
    expect(booking.personalInfo).to.have.property('email', validBooking.personalInfo.email);
    expect(booking.personalInfo).to.have.property('birthday', validBooking.personalInfo.birthday);
    expect(booking.personalInfo).to.have.property('phone', validBooking.personalInfo.phone);
    expect(booking).to.have.property('roomType', validBooking.roomType);
    expect(booking).to.have.property('to', validBooking.to);
    expect(booking).to.have.property('from', validBooking.from);
  });

  it('Should return null if the id not exists', async () => {
    const booking = await Booking.read({ id: 'fake id' });
    expect(booking).to.be.equal(null);
  });

  it('Should update a booking', async () => {
    validBooking.guestEthAddress = validBookingDB.guestEthAddress = `0xe91036d59eAd8b654eE2F5b354245f6D7eD2487e${Date.now()}`;
    const dbBooking = new BookingModel(validBookingDB);
    await dbBooking.save();
    const booking = await Booking.read({ id: dbBooking._id });
    const newPersonalInfo = { email: 'new@email.com' };
    booking.personalInfo = newPersonalInfo;
    await booking.save();
    const booking2 = await Booking.read({ id: dbBooking._id });
    expect(booking2).to.be.an.instanceof(Booking);
    expect(booking2).to.have.property('personalInfo');
    expect(booking2.personalInfo).to.have.property('email', newPersonalInfo.email);
  });

  it('Should delete a booking', async () => {
    validBooking.guestEthAddress = validBookingDB.guestEthAddress = `0xe91036d59eAd8b654eE2F5b354245f6D7eD2487e${Date.now()}`;
    const dbBooking = new BookingModel(validBookingDB);
    await dbBooking.save();
    const booking = await Booking.read({ id: dbBooking._id });
    await booking.delete();
    const dbReadBooking = await BookingModel.findById(booking.id).exec();
    expect(dbReadBooking).to.be.an.equal(null);
  });
});
