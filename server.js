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
				count: 6,
				items: [
					{
						id: "AC2025_001",
						question:
							"The Asia Cup tournament, which is scheduled to take place in 2025, is primarily contested in which sport?",
						answers: [
							"Football",
							"Basketball",
							"Cricket",
							"Field Hockey",
						],
						answerToken:
							"U2FsdGVkX19qBgKZDuwH2tei7K6cNXL64ES6DcWxxJKgqmkBF+K1S6E7U1GcQPkr",
						correctIndex: 2,
					},
					{
						id: "AC2025_002",
						question:
							"Which of these governing bodies is responsible for organizing the Asia Cup tournament, including the 2025 edition?",
						answers: [
							"International Cricket Council (ICC)",
							"Asian Football Confederation (AFC)",
							"Asian Cricket Council (ACC)",
							"Olympic Council of Asia (OCA)",
						],
						answerToken:
							"U2FsdGVkX187ofcSIKEkPcXHCgYwxGQFQ4VmtX6N44lVgUpp/0vEA5sbEdJ7F5xe",
						correctIndex: 2,
					},
					{
						id: "AC2025_003",
						question:
							"Historically, which nation holds the record for the most titles won in the Asia Cup tournament, preceding the 2025 event?",
						answers: [
							"Pakistan",
							"India",
							"Sri Lanka",
							"Bangladesh",
						],
						answerToken:
							"U2FsdGVkX1+lxB677YU9gTiy75+rcGrbjjYu299YigAbNlVssFexO/BAysnhxoS2",
						correctIndex: 1,
					},
					{
						id: "AC2025_004",
						question:
							"The Asia Cup tournament is generally held how often, setting the stage for events like the 2025 edition?",
						answers: [
							"Every year",
							"Every two years",
							"Every three years",
							"Every four years",
						],
						answerToken:
							"U2FsdGVkX19u2BWVOSlT60oPjUIVPqG21O42YeCzmHoD9k4e9Okw2Jju0Ryv2p0N",
						correctIndex: 1,
					},
					{
						id: "AC2025_005",
						question:
							"The format of the Asia Cup, such as the upcoming 2025 edition, often alternates between One Day International (ODI) and Twenty20 International (T20I) to prepare teams for which type of major international event?",
						answers: [
							"Test series championships",
							"Global T20 leagues",
							"The Olympic Games",
							"ICC global limited-overs tournaments",
						],
						answerToken:
							"U2FsdGVkX19vTNWDiX+1EvwNnGs3u5ufbq94LoOEW31xdlSOig+kQVRfFjMyP0bS",
						correctIndex: 3,
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
