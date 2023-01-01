const assert = require("node:assert");
const { hash, verify } = require("./dist");

(async function () {
    // checks that password verification works
    const password = "password";
    const hashedPassword = await hash(password);
    const matches = await verify(password, hashedPassword);
    assert.ok(matches, "Password should match");

    // checks that the salt is added correctly and similar passwords give different (hash + salt)s
    const samePassword = "password";
    const samePasswordHashed = await hash(samePassword);
    const hashesAreEqual = hashedPassword === samePasswordHashed;
    const saltIsWorking = !hashesAreEqual;
    assert.ok(saltIsWorking, "Salt should be working");

    // checks that a wrong password doesn't pass verification
    const differentPassword = "different";
    const differentPasswordsMatch = await verify(differentPassword, hashedPassword);
    assert.ok(!differentPasswordsMatch, "Different passwords should not match");

    // checks that
    const differentPasswordHashed = await hash(differentPassword);
    const differentHashesAreDifferent =
        differentPasswordHashed.split(".")[0] !== hashedPassword.split(".")[0];
    assert.ok(differentHashesAreDifferent, "Different passwords should yield different hashes");

    console.log("✅ All tests passed");
})();
