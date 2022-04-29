const ExpressError = require("../expressError")
const db = require(("../db"))
const express = require("express");

let router = new express.Router();

router.get("/",
      async function (req, res, next) {
  try {
    
    const results = await db.query(
      `select * from companies`);

    return res.json({"companies":results.rows});
  }

  catch (err) {
    return next(err);
  }
});

//--------------------------------------------
router.get("/:code",
      async function (req, res, next) {
    code = req.params.code;
  try {
    const type = req.query.type;

    const results = await db.query(
      `SELECT code, name, description
       FROM companies
       WHERE code=$1 `, [code]);

       if (results.rows.length === 0) {
        throw new ExpressError(`No such company: ${code}`, 404)
      }
      const invResult = await db.query(
        `SELECT id
         FROM invoices
         WHERE comp_code = $1`,
      [code]
  );

    const company = results.rows[0];
    const invoices = invResult.rows;
    company.invoices = invoices.map(inv => inv.id);
    return res.json({"company":company});
  }

  catch (err) {
    return next(err);
  }
});

//------------------------------------------------
router.post("/", async function (req, res, next) {
    try {
        let {code, name, description} = req.body;
  
      const result = await db.query(
            `INSERT INTO companies (code, name, description) 
             VALUES ($1, $2, $3)
             RETURNING code, name, description`,
          [code, name, description]
      );
  
      return res.status(201).json({"company":result.rows[0]});
    }
  
    catch (err) {
      return next(err);
    }
  });

  //-------------------------------------------------
  router.patch("/:code", async function (req, res, next) {
    try {
      const { name, description } = req.body;
      const code = req.params.code;
  
      const result = await db.query(
            `UPDATE companies SET name = $1, description=$2
             WHERE code = $3
             RETURNING code, name, description`,
          [name, description, code]
      );
  
      if (result.rows.length === 0) {
        throw new ExpressError(`No such company: ${code}`, 404);
      }
      else{
        return res.json({"comapny":result.rows[0]});
      }
    
    }
  
    catch (err) {
      return next(err);
    }
  });

  //-------------------------------------------------------------
  
router.delete("/:code", async function (req, res, next) {
    code = req.params.code; 
    try {
      const result = await db.query(
          "DELETE FROM companies WHERE code = $1",
          [code]
      );
  

    if (result.rows.length == 0) {
      throw new ExpressError(`No such company: ${code}`, 404)
    } else {
      return res.json({"status": "deleted"});
    }

    }
  
    catch (err) {
      return next(err);
    }
  });


  module.exports = router;