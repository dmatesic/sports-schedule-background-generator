import chai from 'chai';
import chaiImmutable from 'chai-immutable'; // Provide a set of Chai assertions for Facebook's Immutable library
import dirtyChai from 'dirty-chai'; // Extends Chai with lint-friendly terminating assertions

chai.use(chaiImmutable);
chai.use(dirtyChai);

