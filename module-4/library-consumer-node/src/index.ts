// Import an external ES Module from ../library-build (remember to build that before running this)
import { foo } from "testlib";
// Import from local path (.js extension needed when running ES Modules)
import util from "./util.js";
// Importing commonJS module as well
import _ from "lodash"

foo();
util();
console.log(_.identity("lodash says hi"))
console.log("NODE JS ROCKS!")