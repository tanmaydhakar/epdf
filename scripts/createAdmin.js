const path = require('path');
const readline = require('readline');

const db = require(path.resolve('./models'));
const { User, Role, UserRole } = db;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter userId: ', async function (userId) {
  try {
    const field = {
      name: 'Admin'
    };
    const role = await Role.findBySpecificField(field);

    if (!role) {
      console.log('\nRole admin not found. Please seed roles and try again');
      rl.close();
    }

    const user = await User.findByPk(userId);
    if (!user) {
      console.log('\nuser not found. Please enter a valid userId');
      rl.close();
    }
    const userRole = new UserRole();
    userRole.user_id = user.id;
    userRole.role_id = role.id;
    await userRole.save();

    rl.close();
  } catch (error) {
    console.log('\nSome unexpected error occured');
    process.exit(0);
  }
});

rl.on('close', function () {
  console.log('\n User has been promoted to admin successfully');
  process.exit(0);
});
