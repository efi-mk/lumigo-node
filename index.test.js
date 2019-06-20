const lambdaLocal = require('lambda-local');
const crypto = require('crypto');

const exampleApiGatewayEvent = require('./src/testdata/events/apigw-request.json');

describe.skip('end-to-end lumigo-node', () => {
  const oldEnv = Object.assign({}, process.env);
  let awsEnv = {};
  let token = '';

  beforeEach(() => {
    token = 't_a595aa58c126575c5c41';
    awsEnv = getRandomAwsEnv();
    const { HOME } = oldEnv;
    process.env = { HOME, ...awsEnv };
  });

  afterEach(() => {
    process.env = { ...oldEnv };
  });

  test('real: async rejected', done => {
    jest.setTimeout(30000);
    const edgeHost = 'kzc0w7k50d.execute-api.eu-west-1.amazonaws.com';
    const switchOff = false;
    const lumigo = require('./index')({ token, edgeHost, switchOff });
    const expectedReturnValue = 'Satoshi was here';

    const userHandler = async (event, context, callback) => {
      const AWS = require('aws-sdk');
      AWS.config.update({ region: 'us-west-2' });
      const ddb = new AWS.DynamoDB();
      const params = {
        TableName: 'sagid_common-resources_spans',
        Key: {
          span_id: { S: '6fa4d7ea-93e2-75c1-d75f-b276375c7cc7' },
          span_type: { S: 'function' },
        },
      };

      const data = await ddb.getItem(params).promise();
      throw new Error(expectedReturnValue);
    };

    const callback = function(err, data) {
      expect(err.errorMessage).toEqual(expectedReturnValue);
      done();
    };

    lambdaLocal.execute({
      event: exampleApiGatewayEvent,
      lambdaFunc: { handler: lumigo.trace(userHandler) },
      timeoutMs: 30000,
      environment: awsEnv,
      verboseLevel: 0, // Verbose 3 will throw the error to stderr
      callback,
    });
  });

  test('real: async resolved', done => {
    jest.setTimeout(30000);
    const edgeHost = 'kzc0w7k50d.execute-api.eu-west-1.amazonaws.com';
    const switchOff = false;
    const lumigo = require('./index')({ token, edgeHost, switchOff });
    const expectedReturnValue = 'Satoshi was here';

    const userHandler = async (event, context, callback) => {
      const AWS = require('aws-sdk');
      AWS.config.update({ region: 'us-west-2' });
      const ddb = new AWS.DynamoDB();
      const params = {
        TableName: 'sagid_common-resources_spans',
        Key: {
          span_id: { S: '6fa4d7ea-93e2-75c1-d75f-b276375c7cc7' },
          span_type: { S: 'function' },
        },
      };

      const data = await ddb.getItem(params).promise();
      return expectedReturnValue;
    };

    const callback = function(err, data) {
      expect(data).toEqual(expectedReturnValue);
      done();
    };

    lambdaLocal.execute({
      event: exampleApiGatewayEvent,
      lambdaFunc: { handler: lumigo.trace(userHandler) },
      timeoutMs: 30000,
      environment: awsEnv,
      verboseLevel: 0,
      callback,
    });
  });

  test('real: async callback', done => {
    jest.setTimeout(30000);
    const edgeHost = 'kzc0w7k50d.execute-api.eu-west-1.amazonaws.com';
    const switchOff = false;
    const lumigo = require('./index')({ token, edgeHost, switchOff });
    const expectedReturnValue = 'Satoshi was here';

    const userHandler = async (event, context, callback) => {
      const AWS = require('aws-sdk');
      AWS.config.update({ region: 'us-west-2' });
      const ddb = new AWS.DynamoDB();
      const params = {
        TableName: 'sagid_common-resources_spans',
        Key: {
          span_id: { S: '6fa4d7ea-93e2-75c1-d75f-b276375c7cc7' },
          span_type: { S: 'function' },
        },
      };

      const data = await ddb.getItem(params).promise();
      callback(null, expectedReturnValue);
    };

    const callback = function(err, data) {
      expect(data).toEqual(expectedReturnValue);
      done();
    };

    lambdaLocal.execute({
      event: exampleApiGatewayEvent,
      lambdaFunc: { handler: lumigo.trace(userHandler) },
      timeoutMs: 30000,
      environment: awsEnv,
      verboseLevel: 0,
      callback,
    });
  });

  test('real: non async callback', done => {
    jest.setTimeout(30000);
    const edgeHost = 'kzc0w7k50d.execute-api.eu-west-1.amazonaws.com';
    const switchOff = false;
    const lumigo = require('./index')({ token, edgeHost, switchOff });
    const expectedReturnValue = 'Satoshi was here';

    const userHandler = (event, context, callback) => {
      const AWS = require('aws-sdk');
      AWS.config.update({ region: 'us-west-2' });
      const ddb = new AWS.DynamoDB();
      const params = {
        TableName: 'sagid_common-resources_spans',
        Key: {
          span_id: { S: '6fa4d7ea-93e2-75c1-d75f-b276375c7cc7' },
          span_type: { S: 'function' },
        },
      };

      ddb.getItem(params, (err, data) => {
        callback(null, expectedReturnValue);
      });
    };

    const callback = function(err, data) {
      expect(data).toEqual(expectedReturnValue);
      done();
    };

    lambdaLocal.execute({
      event: exampleApiGatewayEvent,
      lambdaFunc: { handler: lumigo.trace(userHandler) },
      timeoutMs: 30000,
      environment: awsEnv,
      verboseLevel: 0,
      callback,
    });
  });

  test('real: non async error thrown', done => {
    jest.setTimeout(30000);
    const edgeHost = 'kzc0w7k50d.execute-api.eu-west-1.amazonaws.com';
    const switchOff = false;
    const lumigo = require('./index')({ token, edgeHost, switchOff });
    const expectedReturnValue = 'Satoshi was here';

    const userHandler = (event, context, callback) => {
      throw new Error(expectedReturnValue);
    };

    const callback = function(err, data) {
      expect(err.errorMessage).toEqual(expectedReturnValue);
      done();
    };

    lambdaLocal.execute({
      event: exampleApiGatewayEvent,
      lambdaFunc: { handler: lumigo.trace(userHandler) },
      timeoutMs: 30000,
      environment: awsEnv,
      verboseLevel: 0, // Verbose 3 will throw the error to stderr
      callback,
    });
  });
});

const getRandomString = evenNrChars =>
  crypto.randomBytes(evenNrChars / 2).toString('hex');

const getRandomAwsEnv = () => {
  const transactionId = getRandomString(10);
  // XXX Add parentId / id mocks (contexts...)
  return {
    LAMBDA_TASK_ROOT: '/var/task',
    LAMBDA_RUNTIME_DIR: '/var/runtime',
    AWS_REGION: 'us-east-1',
    AWS_DEFAULT_REGION: 'us-east-1',
    AWS_LAMBDA_LOG_GROUP_NAME: '/aws/lambda/aws-nodejs-dev-hello',
    AWS_LAMBDA_LOG_STREAM_NAME:
      '2019/05/16/[$LATEST]8bcc747eb4ff4897bf6eba48797c0d73',
    AWS_LAMBDA_FUNCTION_NAME: 'RANDOM_LAMBDA_LOCAL_ENV',
    AWS_LAMBDA_FUNCTION_MEMORY_SIZE: '1024',
    AWS_LAMBDA_FUNCTION_VERSION: '$LATEST',
    _AWS_XRAY_DAEMON_ADDRESS: '169.254.79.2',
    _AWS_XRAY_DAEMON_PORT: '2000',
    AWS_XRAY_DAEMON_ADDRESS: '169.254.79.2:2000',
    AWS_XRAY_CONTEXT_MISSING: 'LOG_ERROR',
    _X_AMZN_TRACE_ID: `Root=1-5cdcf03a-${transactionId};Parent=28effe37598bb622;Sampled=0`,
    AWS_EXECUTION_ENV: 'AWS_Lambda_nodejs8.10',
  };
};
