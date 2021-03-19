var Q_timeline = [];
var side_offset = 200;
var flash_frame = 30;

var Q_trial_specs = [];
var stim_side = [1, -1];
var nTrial = 40; // 40
var lum = 180;
var lum_value = 'rgb(' + lum + ',' + lum + ',' + lum + ')';

for (i = 0; i < nTrial / 2; i++) {
    for (side of stim_side) {
        Q_trial_specs.push({
            startX: side * side_offset,
            stim_side: side,
        });
    }
}

// INSTRUCTIONS
var Instructions = {
    type: 'instructions',
    show_clickable_nav: true,
    pages: ["<p>INSTRUCTIONS</p>" +
        "<p>This Task requires you to keep your eyes on the central white dot.</p>" +
        "<p>A small and transient flash with variable luminance will appear either on the left or on the right side of the dot.</p>" +
        "<p>Shortly afterwards the central dot will turn black, enabling you to make a choice.</p>" +
        "<p>You have to press the left arrow key if the flash was on the left side or the right arrow key if the flash was on the right side</p>" +
        "<p>If you can't see the flash, make a random guess.<p>" +
        "<p>Each flash is dim and really fast. Stay Focused or you'll miss it!</p>",
        "<p>Please make sure that your monitor brightness is set to the maximum, that no lights are pointing toward the monitor.</p>" +
        "<p>And that your display is clean, otherwise it will be difficult to see the flashes.</p>" +
        "<p>Position yourself as indicated in the image above and don't change your position through the experiment.",
        "<p>Point the cursor outside of the window.</p>" +
        "<p>Press Next to start.</p>"
    ]
}
Q_timeline.push(Instructions)

// INITIALIZE QuestO

var Qinit = {
    type: 'html-keyboard-response',
    stimulus: "<p>Quest initialized !</p><p>Press the Spacebar to start.</p>",
    choiches: ['space', ' '],
    on_finish: function(data) {
        var tRange = linspace(129, 160, 60);
        var Q = QuestOCreate(tRange);
        data.Q = Q;
        data.isQ = true;
    }
}
Q_timeline.push(Qinit)

// TRIAL DEFINITION
var fixation = {
    obj_type: 'circle',
    radius: 5,
    origin_center: true,
    fill_color: 'white'
}

var fixation_prompt = {
    obj_type: 'circle',
    radius: 5,
    origin_center: true,
    fill_color: 'black',
    show_start_time: 1000
}

var prompt_keys = {
    obj_type: 'text',
    content: "Flash left (left-arrow) or Flash right (right-arrow) ? \n\n If you didn't see any flash, make a random choice.",
    font: "22px 'Arial'",
    text_color: 'black',
    origin_center: true,
    startY: 300,
    show_start_time: 1000
}

var flash = {
    obj_type: 'circle',
    radius: 15,
    fill_color: lum_value,
    show_start_frame: flash_frame, // frames after the start of the trial
    show_end_frame: flash_frame + 1,
    is_frame: true,
    origin_center: true,
    startX: jsPsych.timelineVariable('startX'),
}

var trial_struct = {
    type: 'psychophysics',
    stimuli: [flash, fixation, fixation_prompt, prompt_keys],
    choices: ['arrowleft', 'arrowright', 'leftarrow', 'rightarrow'],
    response_start_time: 1000,
    data: {
        isQ: true,
        stim_side: jsPsych.timelineVariable('stim_side'),
    },
    on_start: function(trial_struct) {
        var Q = jsPsych.data.get().filter({
            isQ: true
        }).last(1).select('Q').values[0];
        new_lum = Q.trial_value; // adjust this to screen capacity
        var flash_comp = trial_struct.stimuli[0];
        flash_comp.fill_color = 'rgb(' + new_lum + ',' + new_lum + ',' + new_lum + ')';
        trial_struct.data.trial_luminance = new_lum;
        trial_struct.data.Q = Q;
    },


    on_finish: function(data) {
        // store correct answer
        var curr_ans = data.key_press;
        curr_ans = (curr_ans == 39 || curr_ans == 'arrowright' || curr_ans == 'rightarrow') * 2 - 1;
        var curr_ans = curr_ans == data.stim_side;
        data.correct = curr_ans; // this can be cancelled
        data.Q.trial_outcome = curr_ans;
        data.Q = QuestOUpdate(data.Q)
    }
}

var Q_procedure = {
    timeline: [trial_struct],
    timeline_variables: Q_trial_specs,
    randomize_order: true,
    repetitions: 1
}

var Complete_msg = {
    type: 'html-keyboard-response',
    stimulus: "<p>Well Done !</p><p>Threshold Obtained !</p><p>Press the Spacebar to finish.</p>",
    choiches: ['space', ' '],
    data: {
        isThreshold: true,
    },
    on_finish: function(data) {
        var Q = jsPsych.data.get().filter({
            isQ: true
        }).last(1).select('Q').values[0];

        data.isQestimate = true;
        data.Qestimate = QuestOFinish(Q);
    }
}

Q_timeline.push(Q_procedure);
Q_timeline.push(Complete_msg);