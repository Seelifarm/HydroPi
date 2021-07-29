const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

/* const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
}); */

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
    new transports.File({
        filename: 'combined.log',
        level: 'info',
        //format: format.simple()
    }),
    new transports.Console({
        level: 'debug',
/*         format: format.combine(
          format.colorize(),
          format.simple()
        ) */
    }),
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});


//module.exports = logger

module.exports = function(name) {
  // set the default moduleName of the child
  return logger.child({moduleName: name});
}
