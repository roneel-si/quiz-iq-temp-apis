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
				count: 30,
				items: [
					{
						id: "1",
						question:
							"Which NBA team holds the record for the most regular-season wins in a single season with 73 victories?",
						answers: [
							"Golden State Warriors",
							"Chicago Bulls",
							"Los Angeles Lakers",
							"Boston Celtics",
						],
						answerToken:
							"U2FsdGVkX18TJkH7jDrljUfXzb26hAoReDp/+2Ax9PM=",
						correctIndex: 0,
					},
					{
						id: "2",
						question:
							"What legendary Boston Celtics center won 11 NBA championships in 13 seasons, an unparalleled record for a player?",
						answers: [
							"Bill Russell",
							"Kareem Abdul-Jabbar",
							"Wilt Chamberlain",
							"Shaquille O'Neal",
						],
						answerToken:
							"U2FsdGVkX1/lWqV3gZmQ4PY4b4jyzXqvZLKBv95I+UE=",
						correctIndex: 0,
					},
					{
						id: "3",
						question:
							"Which NFL team completed the only perfect undefeated season in the Super Bowl era, going 17-0 in 1972?",
						answers: [
							"Miami Dolphins",
							"New England Patriots",
							"Green Bay Packers",
							"Washington Commanders",
						],
						answerToken:
							"U2FsdGVkX1+QzR3ptEnCqLk+y+4viLL7fBjvrZokW7U=",
						correctIndex: 0,
					},
					{
						id: "4",
						question:
							"What nation has won the FIFA World Cup a record five times, establishing itself as a dominant force in international football?",
						answers: ["Brazil", "Germany", "Italy", "Argentina"],
						answerToken:
							"U2FsdGVkX19Fkhe9V4t+/DaVjJ4M6S2ngSr2AzPkxzI=",
						correctIndex: 0,
					},
					{
						id: "5",
						question:
							"Which MLB franchise is known for its multiple dynastic eras and holds the record for the most World Series championships?",
						answers: [
							"New York Yankees",
							"Boston Red Sox",
							"Los Angeles Dodgers",
							"St. Louis Cardinals",
						],
						answerToken:
							"U2FsdGVkX1+gQJzbK4CpYY76D5nWPtRdYTKg6+QwmK4=",
						correctIndex: 0,
					},
					{
						id: "6",
						question:
							"Which female tennis player achieved the rare 'Golden Slam' in 1988, winning all four Grand Slams and the Olympic gold medal in the same year?",
						answers: [
							"Steffi Graf",
							"Serena Williams",
							"Martina Navratilova",
							"Chris Evert",
						],
						answerToken:
							"U2FsdGVkX1/ygRjlmqxkiTce/JxU0vL9VZUAgp3pcMo=",
						correctIndex: 0,
					},
					{
						id: "7",
						question:
							"What American swimmer holds the record for the most Olympic medals of all time, demonstrating unprecedented dominance in the pool?",
						answers: [
							"Michael Phelps",
							"Mark Spitz",
							"Ian Thorpe",
							"Caeleb Dressel",
						],
						answerToken:
							"U2FsdGVkX1+Uh7BVQXSJ/C6tlPvIKoTUP4g/1rDZP/8=",
						correctIndex: 0,
					},
					{
						id: "8",
						question:
							"Which Jamaican sprinter is widely regarded as the fastest man ever, holding world records in the 100m and 200m dashes and winning multiple Olympic gold medals?",
						answers: [
							"Usain Bolt",
							"Carl Lewis",
							"Jesse Owens",
							"Asafa Powell",
						],
						answerToken:
							"U2FsdGVkX18bGScSzSc9E5PzZl1/N5asuAqZ+pSu9IQ=",
						correctIndex: 0,
					},
					{
						id: "9",
						question:
							"What golfer completed the 'Tiger Slam' by holding all four major championships simultaneously across 2000-2001?",
						answers: [
							"Tiger Woods",
							"Jack Nicklaus",
							"Arnold Palmer",
							"Rory McIlroy",
						],
						answerToken:
							"U2FsdGVkX1/iM2X7ZLG7CArbKwVLrXgTh1CVyJRrRHU=",
						correctIndex: 0,
					},
					{
						id: "10",
						question:
							"Which Formula 1 driver holds the record for the most consecutive World Drivers' Championship titles with five?",
						answers: [
							"Michael Schumacher",
							"Lewis Hamilton",
							"Juan Manuel Fangio",
							"Sebastian Vettel",
						],
						answerToken:
							"U2FsdGVkX19Lq+Fnz4XyuIiB1zOsVoz5+GK43STL3XU=",
						correctIndex: 0,
					},
					{
						id: "11",
						question:
							"Which NHL player holds the record for the most career points (goals and assists) by a significant margin, showcasing unmatched offensive dominance?",
						answers: [
							"Wayne Gretzky",
							"Gordie Howe",
							"Mario Lemieux",
							"Jaromir Jagr",
						],
						answerToken:
							"U2FsdGVkX1+NrP/GoBSC/SUcM1K7/7KqawjavZIHzZM=",
						correctIndex: 0,
					},
					{
						id: "12",
						question:
							"Which heavyweight boxer retired with a perfect undefeated professional record of 49-0?",
						answers: [
							"Rocky Marciano",
							"Muhammad Ali",
							"Joe Louis",
							"Mike Tyson",
						],
						answerToken:
							"U2FsdGVkX19gV2/e8Wb4LTpSqfDu56jkgU+y+2dsVyo=",
						correctIndex: 0,
					},
					{
						id: "13",
						question:
							"What NCAA women's basketball program holds the record for the most national championships, including multiple undefeated seasons?",
						answers: [
							"UConn Huskies",
							"Tennessee Lady Vols",
							"Stanford Cardinal",
							"Baylor Bears",
						],
						answerToken:
							"U2FsdGVkX1+iDr9o+PPRTfGZhYFwNwLa3LKdo0SWkak=",
						correctIndex: 0,
					},
					{
						id: "14",
						question:
							"Which Australian cricketer is widely regarded as the greatest batsman of all time, holding an unparalleled Test batting average of 99.94?",
						answers: [
							"Don Bradman",
							"Sachin Tendulkar",
							"Brian Lara",
							"Ricky Ponting",
						],
						answerToken:
							"U2FsdGVkX18mPBkNdrNOMtE6AWf9hiMETv6lN47j2Fk=",
						correctIndex: 0,
					},
					{
						id: "15",
						question:
							"What American gymnast is considered the most decorated in her sport's history, with numerous World and Olympic medals?",
						answers: [
							"Simone Biles",
							"Nadia Comăneci",
							"Mary Lou Retton",
							"Gabby Douglas",
						],
						answerToken:
							"U2FsdGVkX194WO9m02VnBOXnzmt0BtiRIPSRHoZvrrs=",
						correctIndex: 0,
					},
					{
						id: "16",
						question:
							"Which national team has won the Rugby World Cup a record four times, demonstrating consistent dominance in the sport?",
						answers: [
							"South Africa",
							"New Zealand",
							"Australia",
							"England",
						],
						answerToken:
							"U2FsdGVkX18iM+Hsb3aCPNtILdCQ4D2yZfYfj8gqxiM=",
						correctIndex: 0,
					},
					{
						id: "17",
						question:
							"Which nation has overwhelmingly dominated the sport of table tennis, especially at the Olympic Games and World Championships?",
						answers: ["China", "South Korea", "Sweden", "Germany"],
						answerToken:
							"U2FsdGVkX1+yvxLVMHe8boSaIGFzoSPfLiq0GbuZPH4=",
						correctIndex: 0,
					},
					{
						id: "18",
						question:
							"What legendary Belgian cyclist, known as 'The Cannibal', dominated cycling in the 1960s and 70s, winning the Tour de France five times along with numerous other major races?",
						answers: [
							"Eddy Merckx",
							"Jacques Anquetil",
							"Bernard Hinault",
							"Miguel Indurain",
						],
						answerToken:
							"U2FsdGVkX1+Q86Wj7UP1R9sf35FQuCrmgJbUU1MEIMU=",
						correctIndex: 0,
					},
					{
						id: "19",
						question:
							"What NBA coach holds the record for the most championships won, leading the Boston Celtics to an era of unparalleled dominance?",
						answers: [
							"Red Auerbach",
							"Phil Jackson",
							"Gregg Popovich",
							"Pat Riley",
						],
						answerToken:
							"U2FsdGVkX19OYmWs6+jMvtod32gPI7XCQS/yj7iIc+E=",
						correctIndex: 0,
					},
					{
						id: "20",
						question:
							"What NFL coach led the Green Bay Packers to five NFL championships, including the first two Super Bowls, establishing a dynasty in the 1960s?",
						answers: [
							"Vince Lombardi",
							"Bill Belichick",
							"Chuck Noll",
							"Don Shula",
						],
						answerToken:
							"U2FsdGVkX199NO9BsCzeFDvB71BAL+81wLIc35U04fo=",
						correctIndex: 0,
					},
					{
						id: "21",
						question:
							"Which MLB pitcher holds the record for the most career wins (511) and complete games, indicative of a dominant career spanning multiple decades?",
						answers: [
							"Cy Young",
							"Walter Johnson",
							"Nolan Ryan",
							"Randy Johnson",
						],
						answerToken:
							"U2FsdGVkX18VwXK+en3I0gtZ2sZ+3y0f1k/Lzvw005A=",
						correctIndex: 0,
					},
					{
						id: "22",
						question:
							"What dominant defensive end, known as 'The Minister of Defense,' revolutionized the defensive line position and played for the Eagles and Packers?",
						answers: [
							"Reggie White",
							"Lawrence Taylor",
							"Deacon Jones",
							"J.J. Watt",
						],
						answerToken:
							"U2FsdGVkX1+0UbsP4b8ILUYPujcdl8izXnN1JGB+dTA=",
						correctIndex: 0,
					},
					{
						id: "23",
						question:
							"Which NCAA men's basketball program holds the record for the most national championships, with 11 titles?",
						answers: [
							"UCLA Bruins",
							"Kentucky Wildcats",
							"Duke Blue Devils",
							"North Carolina Tar Heels",
						],
						answerToken:
							"U2FsdGVkX195VeOpr4u//CkRtRw/jmwTbajlHla/pqc=",
						correctIndex: 0,
					},
					{
						id: "24",
						question:
							"Which player is widely considered the most naturally talented snooker player ever, holding numerous records including the most century breaks and fastest 147?",
						answers: [
							"Ronnie O'Sullivan",
							"Stephen Hendry",
							"John Higgins",
							"Steve Davis",
						],
						answerToken:
							"U2FsdGVkX190GDThTOnYnvEUNIURsfnAx9ncAtr77GI=",
						correctIndex: 0,
					},
					{
						id: "25",
						question:
							"What national team has won the FIFA Women's World Cup a record four times, showcasing consistent dominance in the sport?",
						answers: [
							"United States",
							"Germany",
							"Norway",
							"Japan",
						],
						answerToken:
							"U2FsdGVkX1/K6UaZo+gN8gJ5J9v1MsVCSUuCTftnCns=",
						correctIndex: 0,
					},
					{
						id: "26",
						question:
							"Which American athlete dominated the long jump event for two decades, winning four consecutive Olympic gold medals from 1984 to 1996?",
						answers: [
							"Carl Lewis",
							"Bob Beamon",
							"Jesse Owens",
							"Mike Powell",
						],
						answerToken:
							"U2FsdGVkX1+Ez7yNwGVnW3QCHkdNxrtzTDfnSGb8jcI=",
						correctIndex: 0,
					},
					{
						id: "27",
						question:
							"What legendary female figure skater is known for her unparalleled run of nine consecutive U.S. national titles and five World Championships?",
						answers: [
							"Michelle Kwan",
							"Sonja Henie",
							"Peggy Fleming",
							"Dorothy Hamill",
						],
						answerToken:
							"U2FsdGVkX1/2WDKcHYdJIvCVHvW2ijjf3nCNSpkXRLY=",
						correctIndex: 0,
					},
					{
						id: "28",
						question:
							"Which chess Grandmaster held the World Chess Champion title for an unprecedented 15 consecutive years, dominating the sport from 1985 to 2000?",
						answers: [
							"Garry Kasparov",
							"Magnus Carlsen",
							"Bobby Fischer",
							"Anatoly Karpov",
						],
						answerToken:
							"U2FsdGVkX1+KPMboI1Os4SNT1b6rB7GKN8vZIWyCHDw=",
						correctIndex: 0,
					},
					{
						id: "29",
						question:
							"Which NHL team won four consecutive Stanley Cups in the late 1970s, from 1976 to 1979, marking one of the sport's most dominant dynasties?",
						answers: [
							"Montreal Canadiens",
							"New York Islanders",
							"Edmonton Oilers",
							"Toronto Maple Leafs",
						],
						answerToken:
							"U2FsdGVkX1+lF9HEjl7aMc0eXj9K8pH2qmYRdd3/UfI=",
						correctIndex: 0,
					},
					{
						id: "30",
						question:
							"What legendary Hungarian fencer won seven Olympic gold medals in saber, competing in six different Olympic Games from 1932 to 1960?",
						answers: [
							"Aladár Gerevich",
							"Stanislav Pozdnyakov",
							"Pál Kovács",
							"Viktor Sidyak",
						],
						answerToken:
							"U2FsdGVkX180d6TNetMPqJVEsEZoSi1opXyDCznWuo8=",
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
