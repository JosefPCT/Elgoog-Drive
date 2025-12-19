const prisma = require("../db/client");

// Search Queries

module.exports.getCurrentUserById = async (targetId) => {
  return await prisma.user.findFirst({
    where: {
      id: targetId,
    },
    include: {
      folders: true,
    },
  });
};

// Parameters: FolderID to search, the column name to sort, and if its in ascending order
module.exports.getMainDriveOfUserById = async (id, colName = 'name', isAsc = 'true') => {

  let filesColName = ( colName === 'createdAt' ) ? 'uploadedAt' : colName;

  let sortOrder = ( isAsc === 'true' ) ? 'asc' : 'desc';

  return await prisma.folder.findFirst({
    where: {
      userId: id,
    },
    // include: {
    //   subfolders: true,
    //   files: true
    // },
    include: {
      subfolders: {
        orderBy: { [colName] : sortOrder }
      },
      files: {
        orderBy: { [filesColName] : sortOrder }
      }
    }
  });
};

module.exports.getFolderById = async (id) => {
  return await prisma.folder.findFirst({
    where: {
      id: id,
    },
    include: {
      subfolders: true,
    },
  });
};

module.exports.getFolderByNameInsideAFolder = async (folderId, name) => {
  return await prisma.folder.findFirst({
    where: {
      AND: [{ parentId: folderId }, { name: name }],
    },
  });
};

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
          },
        },
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

module.exports.createFileData = async (parentFolderId, name, size, url) => {
  await prisma.file.create({
    data: {
      folderId: parentFolderId,
      name: name,
      size: size,
      url: url,
    },
  });
};

// EDIT Queries

module.exports.editNameOfFolderById = async (targetFolderId, newName) => {
  await prisma.folder.update({
    where: {
      id: targetFolderId,
    },
    data: {
      name: newName,
    },
  });
};

// DELETE Queries

module.exports.deleteFolderById = async (targetId) => {
  try {
    await prisma.folder.delete({
      where: {
        id: targetId,
      },
    });
  } catch (err) {
    console.error("Error deleting folder: ", err);
    throw err;
  } finally {
    await prisma.$disconnect;
  }
};
