import { neon } from '@neondatabase/serverless';

try {
  neon(undefined);
} catch (e) {
  console.log("TEST 1 undefined: " + e.message);
}

try {
  neon("");
} catch (e) {
  console.log("TEST 2 empty string: " + e.message);
}

try {
  neon("postgresql://dummy_user:dummy_password@ep-dummy-db.us-east-2.aws.neon.tech/dummy_db?sslmode=require");
  console.log("TEST 3 dummy string: SUCCESS");
} catch (e) {
  console.log("TEST 3 dummy string: " + e.message);
}

try {
  neon("invalid");
  console.log("TEST 4 invalid string: SUCCESS");
} catch (e) {
  console.log("TEST 4 invalid string: " + e.message);
}
