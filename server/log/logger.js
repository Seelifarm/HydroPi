const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;


const myFormat = printf(({ level, message, moduleName, timestamp, stack }) => {
  return `${timestamp} [${moduleName}] ${level}: ${stack || message}`;
});

const logger = createLogger({
  // level: 'info',
  format: combine(
    format.colorize(),
    label({ label: __filename }), 
    timestamp({ format: 'DD.MM.YYYY HH:mm:ss'}),
    format.errors({stack: true}),
    myFormat
  ),
  // defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console({
      level: 'debug',
  }),
    new transports.File({
        filename: __dirname + '/combined.log',
        level: 'verbose',
        //format: format.simple()
    }),
    new transports.File({ 
      filename: __dirname + 'error.log', 
      level: 'error' }),
  ],
});


//module.exports = logger
module.exports = function(name) {
  // set the default moduleName of the child
  return logger.child({moduleName: name});
}
