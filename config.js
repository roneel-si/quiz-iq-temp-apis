// Configuration file for environment variables
require("dotenv").config();

module.exports = {
	port: process.env.PORT || 3005,
	aws: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION || "us-east-1",
		bucketName: process.env.AWS_S3_BUCKET_NAME,
	},
	nodeEnv: process.env.NODE_ENV || "development",
};
