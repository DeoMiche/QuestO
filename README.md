# QuestO
QuestO (Quest Online) is a small JavaScript library that implements the QUEST maximum likelihood procedure for the estimation of psychophysics thresholds, originally developed by Watson and Pelli (1983).
QuestO is still in its initial stages of development. If you notice any bugs or need addictional functionalities, feel free to contact me at md5050@nyu.edu .
This library is intended to be used with JSpsych and the Psychphysics plugin, the files in the DEMO folder show how to integrate QuestO in your online experiments by taking advantage of the 'on_start' and 'on_finish' plugin properties.

# General Instructions
You begin by calling QuestOCreate(tRange), telling Quest what is the range of values in which you think the threshold is located (tRange). QuestO create a Quest object, which we usually call "Q", to store this values. Then you run some number of trials, typically 40. For each trial you ask Quest to recommend a test intensity (Q.trial_value). Then you actually test the observer at some intensity, not necessarily what Quest recommended, and then you call QuestOUpdate(Q) to report to Quest the actual intensity used (Q.trial_value), whether the observer got it right (Q.trial_outcome) and to update the posterior probability density function. QuestO saves this information in the "Q" object. This cycle is repeated for each trial. Finally, at the end, you call QuestOFinish(Q) to provide a final threshold estimate, usually the mean and sd of the posterior pdf.

