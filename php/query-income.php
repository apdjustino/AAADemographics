<?php

function dbConnect()
{
    $serverName = 'postgresql';
    $uName = 'gisteam';
    $pWord = 'gisDB1';
    $db = 'external';
    
    try
    {
        //instantiate a PDO object and set connection properties
        
        $conn = new PDO("pgsql:host=$serverName;port=5432;dbname=$db;user=$uName;password=$pWord");
        
        //return connection object

        return $conn;
    }
    // if connection fails
    
    catch (PDOException $e)
    {
        die('Connection failed: ' . $e->getMessage());
    }
}


function incomeQuery()
{
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $raceArr = $request->race;
    $ageArr = $request->ageGrp;
    
    $raceParams = join(', ', array_fill(0, count($raceArr), '?'));
    $ageParams = join(', ', array_fill(0, count($ageArr), '?'));

    $allParams = array_merge($raceArr, $ageArr);
    
    
   
    //add areaName to new array
   
    
    //$measureName = array('measure' => 'crude oil production');
    $conn = dbConnect();
    
    $sqlCmd = <<< sql
            SELECT aaa_blk_grps."GEOid2", aaa_blk_grps.county, sum(value) as "grp_tot", tot_dem, tot_inc, sum(value)/nullif(tot_dem,0) as "pct"
            from aaa_blk_grps, aaa_income where aaa_blk_grps."GEOid2" = aaa_income."GEOid2" AND income_grp IN($raceParams) AND age_grp IN($ageParams) GROUP BY aaa_blk_grps."GEOid2", aaa_blk_grps.county, tot_dem, tot_inc
sql;
    
    $stmt = $conn->prepare($sqlCmd);    
    $stmt->execute($allParams);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
    

            
}

incomeQuery();