import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, TextField, Button, IconButton, Switch, Slider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useParams } from 'react-router-dom';
import { PhotoCamera } from '@mui/icons-material';

const AssistantSettings = () => {
  const { assistantTitle } = useParams<{ assistantTitle: string }>();
  const [value, setValue] = useState(0);
  const [rolePrompt, setRolePrompt] = useState(''); // State for role prompt
  const [avatar, setAvatar] = useState(''); // State for avatar
  const [bgColor, setBgColor] = useState('#ffffff'); // State for background color
  const [name, setName] = useState(assistantTitle); // State for assistant name
  const [description, setDescription] = useState(''); // State for assistant description
  const [tag, setTag] = useState(''); // State for tag

  // Chat Settings State
  const [chatWindowStyle, setChatWindowStyle] = useState('conversation'); // Default style
  const [userInputPreprocessing, setUserInputPreprocessing] = useState('');
  const [autoCreateTopic, setAutoCreateTopic] = useState(false);
  const [messageThreshold, setMessageThreshold] = useState(2);
  const [limitHistoryMessageCount, setLimitHistoryMessageCount] = useState(0);
  const [attachedHistoryMessageCount, setAttachedHistoryMessageCount] = useState(8);
  const [enableAutoSummary, setEnableAutoSummary] = useState(false);

  // Model Settings State
  const [model, setModel] = useState('GPT-4o mini'); // Default model
  const [creativityLevel, setCreativityLevel] = useState(1.0);
  const [opennessToIdeas, setOpennessToIdeas] = useState(1.0);
  const [expressionDivergence, setExpressionDivergence] = useState(0.0);
  const [vocabularyRichness, setVocabularyRichness] = useState(0.0);
  const [enableMaxTokensLimit, setEnableMaxTokensLimit] = useState(false);
  const [enableReasoningEffortAdjustment, setEnableReasoningEffortAdjustment] = useState(false);

  // Speech Service State
  const [textToSpeechService, setTextToSpeechService] = useState('OpenAI'); // Default service
  const [textToSpeechVoice, setTextToSpeechVoice] = useState('alloy'); // Default voice
  const [speechRecognitionLanguage, setSpeechRecognitionLanguage] = useState('Follow System'); // Default language

  // Plugin List State
  const [plugins, setPlugins] = useState([
    { name: 'Artifacts', enabled: true },
    { name: 'DALL·E 3', enabled: true },
  ]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleRolePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRolePrompt(event.target.value);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = URL.createObjectURL(event.target.files[0]);
      setAvatar(file);
    }
  };

  const togglePlugin = (index: number) => {
    const updatedPlugins = [...plugins];
    updatedPlugins[index].enabled = !updatedPlugins[index].enabled;
    setPlugins(updatedPlugins);
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h6">Settings for {assistantTitle}</Typography>
      <Tabs value={value} onChange={handleChange} aria-label="settings tabs">
        <Tab label="Role Setting" />
        <Tab label="Assistant Information" />
        <Tab label="Chat Settings" />
        <Tab label="Model Settings" />
        <Tab label="Speech Service" />
        <Tab label="Plugin List" />
      </Tabs>
      <Box sx={{ marginTop: 2 }}>
        {value === 0 && (
          <Box>
            <Typography variant="body1">Enter role prompt word:</Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Role Prompt"
              value={rolePrompt}
              onChange={handleRolePromptChange}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={() => console.log(rolePrompt)}>
              Save
            </Button>
          </Box>
        )}
        {value === 1 && (
          <Box>
            <Typography variant="h6">Assistant Information</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                type="file"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-upload">
                <IconButton color="primary" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
              {avatar && <img src={avatar} alt="Avatar" style={{ width: 48, height: 48, borderRadius: '50%', marginLeft: 8 }} />}
            </Box>
            <Typography variant="body1">Background Color:</Typography>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{ marginBottom: 16 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Assistant Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={() => console.log({ avatar, bgColor, name, description, tag })}>
              Save
            </Button>
          </Box>
        )}
        {value === 2 && (
          <Box>
            <Typography variant="h6">Chat Settings</Typography>
            <Typography variant="body1">Chat Window Style:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Button variant={chatWindowStyle === 'conversation' ? 'contained' : 'outlined'} onClick={() => setChatWindowStyle('conversation')}>
                Conversation Mode
              </Button>
              <Button variant={chatWindowStyle === 'document' ? 'contained' : 'outlined'} onClick={() => setChatWindowStyle('document')}>
                Document Mode
              </Button>
            </Box>
            <TextField
              fullWidth
              variant="outlined"
              label="User Input Preprocessing"
              value={userInputPreprocessing}
              onChange={(e) => setUserInputPreprocessing(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="body1">Auto Create Topic:</Typography>
            <Switch checked={autoCreateTopic} onChange={() => setAutoCreateTopic(!autoCreateTopic)} />
            <Typography variant="body1">Message Threshold:</Typography>
            <Slider
              value={messageThreshold}
              onChange={(e, newValue) => setMessageThreshold(newValue as number)}
              min={0}
              max={10}
              step={1}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
            <Typography variant="body1">Limit History Message Count:</Typography>
            <TextField
              type="number"
              variant="outlined"
              value={limitHistoryMessageCount}
              onChange={(e) => setLimitHistoryMessageCount(Number(e.target.value))}
              sx={{ mb: 2 }}
            />
            <Typography variant="body1">Attached History Message Count:</Typography>
            <TextField
              type="number"
              variant="outlined"
              value={attachedHistoryMessageCount}
              onChange={(e) => setAttachedHistoryMessageCount(Number(e.target.value))}
              sx={{ mb: 2 }}
            />
            <Typography variant="body1">Enable Automatic Summary of Chat History:</Typography>
            <Switch checked={enableAutoSummary} onChange={() => setEnableAutoSummary(!enableAutoSummary)} />
          </Box>
        )}
        {value === 3 && (
          <Box>
            <Typography variant="h6">Model Settings</Typography>
            <Typography variant="body1">Model:</Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="body1">Creativity Level:</Typography>
            <Slider
              value={creativityLevel}
              onChange={(e, newValue) => setCreativityLevel(newValue as number)}
              min={0}
              max={2}
              step={0.1}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
            <Typography variant="body1">Openness to Ideas:</Typography>
            <Slider
              value={opennessToIdeas}
              onChange={(e, newValue) => setOpennessToIdeas(newValue as number)}
              min={0}
              max={1}
              step={0.1}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
            <Typography variant="body1">Expression Divergence:</Typography>
            <Slider
              value={expressionDivergence}
              onChange={(e, newValue) => setExpressionDivergence(newValue as number)}
              min={0}
              max={1}
              step={0.1}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
            <Typography variant="body1">Vocabulary Richness:</Typography>
            <Slider
              value={vocabularyRichness}
              onChange={(e, newValue) => setVocabularyRichness(newValue as number)}
              min={0}
              max={1}
              step={0.1}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
            <Typography variant="body1">Enable Max Tokens Limit:</Typography>
            <Switch checked={enableMaxTokensLimit} onChange={() => setEnableMaxTokensLimit(!enableMaxTokensLimit)} />
            <Typography variant="body1">Enable Reasoning Effort Adjustment:</Typography>
            <Switch checked={enableReasoningEffortAdjustment} onChange={() => setEnableReasoningEffortAdjustment(!enableReasoningEffortAdjustment)} />
          </Box>
        )}
        {value === 4 && (
          <Box>
            <Typography variant="h6">Speech Service</Typography>
            <Typography variant="body1">Text-to-Speech Service:</Typography>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel id="tts-service-label">Text-to-Speech Service</InputLabel>
              <Select
                labelId="tts-service-label"
                value={textToSpeechService}
                onChange={(e) => setTextToSpeechService(e.target.value)}
              >
                <MenuItem value="OpenAI">OpenAI</MenuItem>
                {/* Add more options as needed */}
              </Select>
            </FormControl>
            <Typography variant="body1">Text-to-Speech Voice:</Typography>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel id="tts-voice-label">Text-to-Speech Voice</InputLabel>
              <Select
                labelId="tts-voice-label"
                value={textToSpeechVoice}
                onChange={(e) => setTextToSpeechVoice(e.target.value)}
              >
                <MenuItem value="alloy">Alloy</MenuItem>
                {/* Add more options as needed */}
              </Select>
            </FormControl>
            <Typography variant="body1">Speech Recognition Language:</Typography>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel id="speech-recognition-language-label">Speech Recognition Language</InputLabel>
              <Select
                labelId="speech-recognition-language-label"
                value={speechRecognitionLanguage}
                onChange={(e) => setSpeechRecognitionLanguage(e.target.value)}
              >
                <MenuItem value="Follow System">Follow System</MenuItem>
                {/* Add more options as needed */}
              </Select>
            </FormControl>
          </Box>
        )}
        {value === 5 && (
          <Box>
            <Typography variant="h6">Plugin List</Typography>
            {plugins.map((plugin, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1">{plugin.name}</Typography>
                <Switch checked={plugin.enabled} onChange={() => togglePlugin(index)} />
              </Box>
            ))}
            <Button variant="outlined" color="primary" onClick={() => console.log('Custom Plugin')}>
              Custom Plugin
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AssistantSettings;