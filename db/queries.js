const prisma = require("../db/client");

// Search Queries

module.exports.getCurrentUserById = async (targetId) => {
  return await prisma.user.findFirst({
    where: {
      id: targetId,
    },
  });
};

module.exports.getMainDriveOfUserById = async (id) => {
  return await prisma.folder.findFirst({
    where: {
      userId: id,
    },
  });
};

module.exports.findUserByEmail = async (targetEmail) => {
  return await prisma.user.findFirst({
    where: {
      email: targetEmail,
    },
  });
};

// Create Queries

module.exports.createUserAndMainFolder = async (
  email,
  hash,
  first_name,
  last_name
) => {
  await prisma.user.create({
    data: {
      email: email,
      hash: hash,
      firstName: first_name,
      lastName: last_name,
      folders: {
        create: {
          name: "My Drive",
        },
      },
    },
  });
};

module.exports.createMainDriveOfUserById = async (id) => {
  await prisma.folder.create({});
};
