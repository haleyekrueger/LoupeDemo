import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

// Initialize Step Functions SDK
const stepFunctions = new AWS.StepFunctions({ region: process.env.AWS_REGION });

// Function to trigger Step Function execution
export const startPatternWorkflow = async (patternId: string, userId: string) => {
  const stateMachineArn = process.env.STEP_FUNCTION_ARN; // Store ARN in .env

  const params = {
    stateMachineArn,
    input: JSON.stringify({ patternId, userId }),
  };

  try {
    const result = await stepFunctions.startExecution(params).promise();
    console.log("Step Function started:", result);
    return result.executionArn;
  } catch (error) {
    console.error("Error starting Step Function:", error);
    throw error;
  }
};
