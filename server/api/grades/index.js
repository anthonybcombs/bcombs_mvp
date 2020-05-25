import { makeDb } from "../../helpers/database";

export const getGrades = async () => {
  const db = makeDb();
  const result = [];
  try {
    const grades = await db.query(
      "SELECT BIN_TO_UUID(ID) as id,name FROM grades"
    );
    grades.forEach((grade) => {
      result.push({ id: grade.id, name: grade.name });
    });
    return result;
  } catch (error) {
  } finally {
    await db.close();
  }
};
