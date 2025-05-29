import { Amplify} from 'aws-amplify';
import awsExports from '../../aws-exports';
import AsyncStorage from '@react-native-async-storage/async-storage';

const configureAmplify = () => {
  try {
    // Check if awsconfig exists
    if (!awsExports) {
      throw new Error('aws-exports.js file is missing or invalid');
    }
    Amplify.configure(awsExports);
    console.log('Amplify object after configure:', Amplify);
    // Configure Amplify with additional settings
    Amplify.configure({
      ...awsExports,
      storage: AsyncStorage,
      Analytics: { disabled: true },
    });
    
    console.log('✅ Amplify configured successfully');
  } catch (error) {
    console.error('❌ Failed to configure Amplify:', error);
    // Consider additional error handling here
  }
};

// Call the configuration function
configureAmplify();

