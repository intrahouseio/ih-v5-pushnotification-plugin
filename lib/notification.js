const NodeRSA = require('node-rsa');
const rp = require('request-promise');
const fs = require('fs');

const pub_key = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgcFJCYRmtvm73xNeVM7S
b3LGOtIXQe17v33W5VEmqJ1QE/ow7dkeQbCdVGh9BPqDApPoIV8sK8tKkKboyc8M
AG5NGfdmJj72fkstXeJDlNWZg12jwAfNUjsMIbrjX6b+wN6B88Gq7YB+8kXC6v2R
Q+Y8e8QYgb7BVxXAziRYrmJu2p3Xz3WilfqHI9hwo95HfRMov1BuB6BnSJWsLUIs
eIvnmkBsp2QORKMOC54zz0O3ocE3GTUH/LP/Iq2oqlU+/QqcjqxFaDcyy69xAK4S
yH//fR+7ylD4FBo+7FZfZbb4G4g2MSPvxVeh1SI4GN8lhHMeGacF5BXnoV+Ytebf
dQIDAQAB
-----END PUBLIC KEY-----`;




const public = new NodeRSA();

public.importKey(pub_key, 'pkcs8-public');

function notification(data) {
  const body = public.encrypt(JSON.stringify(data), 'base64');
  const options = {
      method: 'POST',
      uri: 'http://push.ih-systems.com:48000/send?hwid=' + data.suuid,
      body,
      headers: { 'Content-Type': 'text/plain ' },
  };
  return rp(options);
}

module.exports = notification;
