%%

simData = readtable('C:\Users\Michele\Desktop\RA\JS Psych\3_Psychophisics_DEMO\QuestO\QuestSimulationData.csv');
simData = table2array(simData(:,1));

psdData = readtable('C:\Users\Michele\Desktop\RA\JS Psych\3_Psychophisics_DEMO\QuestO\QuestSimulationData (1).csv');
psdData = table2array(psdData(:,1));

pfData = readtable('C:\Users\Michele\Desktop\RA\JS Psych\3_Psychophisics_DEMO\QuestO\QuestSimulationData (2).csv');
pfData = table2array(pfData(:,1));

figure
subplot(311)
plot(pfData)
subplot(312)
histogram(simData)
subplot(313)
plot(psdData)