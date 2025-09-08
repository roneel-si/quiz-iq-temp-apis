const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");
const axios = require("axios");
const config = require("./config");

const app = express();

// Middleware
app.use(express.json());
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: "*",
	}),
);

// Configure AWS
AWS.config.update({
	accessKeyId: config.aws.accessKeyId,
	secretAccessKey: config.aws.secretAccessKey,
	region: config.aws.region,
});

const s3 = new AWS.S3();

// Health check endpoint
app.get("/", (req, res) => {
	res.json({
		message: "Node.js Express API Server is running!",
		endpoints: {
			"POST /api/generate-signed-url":
				"Generate a signed URL for S3 file upload",
			"POST /api/trivia": "Get trivia questions",
		},
	});
});

// POST endpoint to generate signed URL
app.post("/api/v1/generate-signed-url", async (req, res) => {
	try {
		return res.json({
			data: {
				signed_token: +new Date(),
			},
			meta: {},
		});
	} catch (error) {
		console.error("Error generating signed URL:", error);
		res.status(500).json({
			error: "Failed to generate signed URL",
			details: error.message,
		});
	}
});

// POST endpoint to get trivia questions
app.get("/api/v1/generate-trivia", async (req, res) => {
	try {
		let { quiz_token } = req.headers;
		let title = req.query.title;

		if (!title) {
			return res.status(403).json({
				data: {
					messages: "Title is required in query string",
				},
				meta: {},
			});
		}
		if (
			!quiz_token ||
			!title ||
			parseInt(quiz_token) + 1 * 60 * 1000 < parseInt(+new Date())
		) {
			return res.status(403).json({
				data: {
					messages: "Authorization Error. Token Expired",
				},
				meta: {},
			});
		}
		res.json({
			data: {
				count: 5,
				items: [
					{
						id: "AC001",
						question:
							"Which nation holds the record for the most titles in the history of the men's Cricket Asia Cup?",
						answers: [
							"Pakistan",
							"India",
							"Sri Lanka",
							"Bangladesh",
						],
						answerToken: "qX6nmScroSfih0++PZoo7g==",
						correctIndex: 1,
					},
					{
						id: "AC002",
						question:
							"The Asia Cup cricket tournament primarily features which format of the game?",
						answers: [
							"Test Matches",
							"Twenty20 (T20)",
							"One Day Internationals (ODI)",
							"Both ODI and T20, depending on the edition",
						],
						answerToken: "DD15hw5L5h68qs/h392BzA==",
						correctIndex: 3,
					},
					{
						id: "AC003",
						question:
							"Which team emerged victorious in the 2023 Men's Cricket Asia Cup?",
						answers: [
							"Sri Lanka",
							"Pakistan",
							"India",
							"Bangladesh",
						],
						answerToken: "uuZAkcv5zUvtmxNAUxesOg==",
						correctIndex: 2,
					},
					{
						id: "AC004",
						question:
							"Which organization is responsible for organizing the Asia Cup cricket tournament?",
						answers: [
							"International Cricket Council (ICC)",
							"Asian Cricket Council (ACC)",
							"Board of Control for Cricket in India (BCCI)",
							"Pakistan Cricket Board (PCB)",
						],
						answerToken: "xY7HwK7CxZQnuwp3XoNkVQ==",
						correctIndex: 1,
					},
					{
						id: "AC005",
						question:
							"In what year was the inaugural Men's Cricket Asia Cup tournament held?",
						answers: ["1984", "1992", "1978", "2000"],
						answerToken: "t1QRIwAgh6lOtGpxy6F0qQ==",
						correctIndex: 0,
					},
				],
			},
			meta: {},
		});
	} catch (error) {
		console.error("Error fetching trivia questions:", error);
		res.status(500).json({
			error: "Failed to fetch trivia questions",
			details: error.message,
		});
	}
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		error: "Something went wrong!",
		details: err.message,
	});
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({
		error: "Endpoint not found",
		availableEndpoints: {
			"GET /": "API information",
			"POST /api/generate-signed-url": "Generate signed URL",
			"POST /api/trivia": "Get trivia questions",
		},
	});
});

const PORT = config.port;
app.listen(PORT, () => {
	console.log(`🚀 Server is running on http://localhost:${PORT}`);
	console.log(`📋 Available endpoints:`);
	console.log(`   GET  /                        - API information`);
	console.log(`   POST /api/generate-signed-url - Generate signed URL`);
	console.log(`   POST /api/trivia              - Get trivia questions`);
});
