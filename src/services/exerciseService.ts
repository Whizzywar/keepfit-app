// src/services/exerciseService.ts
const BASE_URL = "https://exercisedb.p.rapidapi.com";

// ✅ Key defined ONCE here — used everywhere
const HEADERS = {
  "X-RapidAPI-Key": "8e8f0df4fcmsha614395d4ca2eb7p1ee576jsnfbd32294c382",
  "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
};

export type ExerciseData = {
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  bodyPart: string;
  equipment: string;
  secondaryMuscles: string[];
  instructions: string[];
};

export async function getExerciseByName(
  name: string,
): Promise<ExerciseData | null> {
  try {
    const url = `${BASE_URL}/exercises/name/${encodeURIComponent(name)}?limit=1`;
    const res = await fetch(url, { headers: HEADERS });
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`❌ No match for: "${name}"`);
      return null;
    }

    console.log(`✅ Found: "${data[0].name}"`);
    return data[0];
  } catch (err) {
    console.error(`Error fetching "${name}":`, err);
    return null;
  }
}

export async function getExercisesByBodyPart(
  bodyPart: string,
  limit = 5,
): Promise<ExerciseData[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/exercises/bodyPart/${bodyPart}?limit=${limit}`,
      { headers: HEADERS },
    );
    return res.json();
  } catch (err) {
    console.error(`Error fetching bodyPart "${bodyPart}":`, err);
    return [];
  }
}

export async function getExercisesByTarget(
  target: string,
  limit = 5,
): Promise<ExerciseData[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/exercises/target/${encodeURIComponent(target)}?limit=${limit}`,
      { headers: HEADERS },
    );
    return res.json();
  } catch (err) {
    console.error(`Error fetching target "${target}":`, err);
    return [];
  }
}
