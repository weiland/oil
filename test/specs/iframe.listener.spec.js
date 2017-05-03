import Cookie from 'js-cookie';
import { initOilFrame } from "../../src/scripts/iframe.listener";
import { OIL_COOKIE } from '../../src/scripts/constants.js';
import { deleteAllCookies } from "../utils";

describe('iframe.listener', () => {

  beforeEach(() => {
    initOilFrame();
    deleteAllCookies();
  });

  it('should write cookie', (done) => {
    postMessage({ event: 'oil-poi-activate' }, '*');
    setTimeout(() => {
      let cookie = Cookie.getJSON(OIL_COOKIE.NAME);
      expect(cookie).toBeDefined();
      done();
    });
  });

});