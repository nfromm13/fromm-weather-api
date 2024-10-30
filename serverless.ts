import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'fromm-weather-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'us-east-1',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },

  functions: {
    getCurrentWeather: {
      handler: 'src/functions/getCurrentWeather/index.main',
      events: [
        {
          http: {
            method: 'get',
            path: 'get-current-weather'
          }
        }
      ]
    },

    getFiveDayForecast: {
      handler: 'src/functions/getFiveDayForecast/index.main',
      events: [
        {
          http: {
            method: 'get',
            path: 'get-five-day-forecast'
          }
        }
      ]
    }

  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
