print('Start creating database ##########################')
db = db.getSiblingDB('dev');
db.createUser(
    {
        user: 'annanorri992',
        pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
        roles: ["root"],
    }
);

db = db.getSiblingDB('prod');
db.createUser(
    {
        user: 'annanorri992',
        pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
        roles: ["root"],
    }
);

db = db.getSiblingDB('test');
db.createUser(
    {
        user: 'annanorri992',
        pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
        roles: ["root"],
    }
);
print('End creating database ##########################')