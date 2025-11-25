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
    include: {
      subfolders: true,
    },
  });
};

module.exports.getFolderById = async (id) => {
  return await prisma.folder.findFirst({
    where: {
      id: id
    },
    include: {
      subfolders: true
    }
  })
}

// module.exports.getFoldersByParentId = async (id) => {
//   return await prisma.folder.findMany({
//     where: {
//       parentId: id,
//     },
//   });
// };

module.exports.findUserByEmail = async (targetEmail) => {
  return await prisma.user.findFirst({
    where: {
      email: targetEmail,
    },
  });
};

// Create Queries

module.exports.createUserAndMainFolderThenReturn = async (
  email,
  hash,
  first_name,
  last_name
) => {
  let user;
  try {
    user = await prisma.user.create({
      data: {
        email: email,
        hash: hash,
        firstName: first_name,
        lastName: last_name,
        folders: {
          create: {
            name: "My Drive",
          }
        }
      },
    });
  } catch (err) {
    console.error("Error creating user:", error);
    throw error;
  } finally {
    await prisma.$disconnect;
  }
  return user;
};

module.exports.createMainDriveOfUserById = async (userId) => {
  try {
    await prisma.folder.create({
      data: {
        name: "My Drive",
        userId: userId,
      },
    });
  } catch (err) {
    console.error("Error creating main drive of user: ", err);
    throw error;
  } finally {
    await prisma.$disconnect;
  }
};

module.exports.createSubFolderByParentId = async (
  folderName,
  userId,
  parentId
) => {
  await prisma.folder.create({
    data: {
      name: folderName,
      userId: userId,
      parentId: parentId,
    },
  });
};
