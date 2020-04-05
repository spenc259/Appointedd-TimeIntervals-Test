const fs = require('fs')
const path = './testcase.txt'

fs.readFile(path, (err, txtdata) => {
    console.info("reading file...");

    if (err) {
        throw err
    }
    
    const filedata = txtdata.toString().split("\n");
    let workers = getWorkers(filedata);

    solve(workers)
})

const getWorkers = (filedata) => {
    console.info("getting workers from file...")
    return filedata.map((v,i) => {
        let result = v.match(/\[(.*)\]/);

        if (result === null)
            return

        return result[1];
    })
}

const solve = (workers) => {
    console.info("running solver....");
    let q1 = Question1(workers);
    console.info(q1);
    
    let q2 = Question2(workers);
    console.info(q2);
    
    let q3 = Question3(workers);
    for (let i = 0; i < q3.length; i++) {
        console.info(q3[i]);
    }

    console.info("\n\nsolver complete!\n\n");
}

/* Questions */

const Question1 = (workers) => {
    console.info("\n\nQuestion 1 \nWhat is the starting date and time (in UTC) of the earliest interval where any of the workers are free?");

    // we need to do a comparasion of the earlist starting dates of each interval per worker, then we can compare against all workers
    let starts = []
    // get dates of each worker
    workers.forEach( (w, i) => {
        starts.push( calcTimes(getIntervals(w), 'desc'))
    } )
    
    starts.sort( (a, b) => {
        return a - b;
    } )

    return starts[0];
}


const Question2 = (workers) => {
    console.info("\n\nQuestion 2\nWhat is the ending date and time (in UTC) of the latest interval where any of the workers are free?");
    let ends = []
    // get dates of each worker
    workers.forEach( (w, i) => {
        ends.push( calcTimes(getIntervals(w), 'asc') )
    } )
    
    ends.sort( (a, b) => {
        return b - a;
    } )

    return ends[0];
}


const Question3 = (workers) => {
    console.info("\n\nQuestion 3\nWhat are the intervals of date and times (in UTC) where there are at least 2 workers free?");

    let overlaps = []
    let times = []

    workers.forEach((w, index) => {
        times.push(getIntervals(w));
    })

    // is my start less than their end AND is my end greater than their start
    /// A = 1-----3
    /// B =    2-----4

    // create an array of times start/end
    // foreach time, loop through the sub array [v], split into start and end times
    // loop through again to get the other times to compare against
    // push result of comparasion into the overlaps array
    times.forEach((v,wi) => {

        for(let i = 0; i < v.length; i++) {
            
            // new date to convert the times to UTC
            let starttime = new Date(v[i].split('/')[0]); 
            let endTime = new Date(v[i].split('/')[1]); 

            times.forEach((v,wj) => {

                for(let i = 0; i < v.length; i++) {
                    let othertimes = v[i].split('/');
                    let otherStartTime = new Date(othertimes[0]) // 2
                    let otherEndTime = new Date(othertimes[1]) // 4
                    
                    if (starttime < otherEndTime && endTime > otherStartTime && wi !== wj) {
                        // we need to use new date again here to output the ISO string format
                        overlaps.push(new Date(Math.max(starttime, otherStartTime)).toISOString() + '/' + new Date(Math.min(endTime,otherEndTime)).toISOString())
                    }
                }
            }) 
        }
    }) 

    // ensure we have unique values
    // we may have duplicates due to workers being off at different times
    return [...new Set(overlaps)]
}

/* Helpers */
const getIntervals = (sw) => {
    return sw.split(',');
}

const calcTimes = (intervals, direction) => {
    let times = []

    intervals.forEach((int, index) => {
        let dates = int.split('/');

        if (direction == 'desc') {
            times.push(new Date(dates[0]))
        } else {
            times.push(new Date(dates[1]))
        }
        
    })

    // array sort and return
    times.sort( (a, b) => {
        if (direction == 'desc') {
            return a - b;
        } else {
            return b - a;
        }
    } )

    return times[0];
}

