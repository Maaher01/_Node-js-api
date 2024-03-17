const { format } = require("date-fns");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

exports.logEvents = async (message, logName) => {
	const dateTime = `${format(new Date(), "dd/MM/yyyy\tHH:mm:ss")}`;
	const logItem = `${dateTime}\t${message}\n`;

	try {
		if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
			await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
		}

		await fsPromises.appendFile(
			path.join(__dirname, "..", "logs", logName),
			logItem
		);
	} catch (err) {
		console.log(err);
	}
};

exports.logger = (req, res, next) => {
	this.logEvents(`${req.method}\t${req.url}`, "logs.txt");
	next();
};
