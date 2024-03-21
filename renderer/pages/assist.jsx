import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import OpenAIApi from "openai";
import "regenerator-runtime/runtime";
import Link from "next/link";
import { menu } from "../components/routes";
import styles from "../styles/Assist.module.css";
import navStyles from "../styles/Nav.module.css";
import Image from "next/image";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import svgMicOn from "../public/mic-on.svg";
import svgMicOff from "../public/mic-off.svg";
import svgSend from "../public/send.svg";
import add from "../public/add.svg";
import play from "../public/play.svg";
import pause from "../public/pause.svg";

const modelTypes = [
  "gpt-3.5-turbo",
  "gpt-4",
  "gpt-4-0314",
  "gpt-4-0613",
  "gpt-4-32k",
  "gpt-4-32k-0314",
  "gpt-4-32k-0613",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo-0301",
  "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-16k-0613",
];

export default function Assist(props) {
  const [text, setText] = useState("");
  const [prompts, setPrompts] = useState([]);
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    } = useSpeechRecognition();
  // const [isListening, setIsListening] = useState(false);
  const {pathname} = useRouter();
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);


  // The function to habdle the OpenAI chat completion
  const effect = async () => {
    let utterance = new SpeechSynthesisUtterance();
    const openai = new OpenAIApi({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
    const completion = await openai.chat.completions.create({
      model,
      messages: prompts
    });
    const completionMessage = completion?.choices[0].message;
    setPrompts([ ...prompts, completionMessage ]);
    setText("");
    if(autoSpeak){
      utterance.text = completionMessage.content;
      speechSynthesis.speak(utterance);
    }
  }

  // This useEffect gets triggers for every question added into prompts
  useEffect(() => {
    if(prompts.length > 0 && text){
      effect();
    }
  },[prompts.length])
  useEffect(() => {
    if (finalTranscript !== '') {
      console.log('Got final result:', finalTranscript);
     }
  }, [interimTranscript, finalTranscript]);

  function selectModel(e) {
    setModel(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    setPrompts([
      ...prompts,
      {
        role: "user",
        content: text,
      }
    ]);
  }
  
  function handleChange(e) {
    setText(e.target.value);
  }
  function onStart(e) {
    e.preventDefault();
    setText("");
    setIsListening(true);
    SpeechRecognition.startListening();
  }
  function onStop(e) {
    e.preventDefault();
    SpeechRecognition.stopListening();
    setIsListening(false);
    setText(transcript);
  }
  function onReset(e) {
    onStop(e);
    setText('');
    resetTranscript();
  }
  function speak(content){
    let utterance = new SpeechSynthesisUtterance();
    utterance.text = content;
    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    function stopSpeak(){}
  }
  function stopSpeak(){
  }
  function handleKeyPress (event) {
    if(event.key === 'Enter'){
      handleSubmit(event);
    }
  }
  function handleCheck(e){
    setAutoSpeak(e.target.checked);
  }
  return (
    <section>
        <nav className={navStyles.nav}>
          <ul className={navStyles.list}>
            {menu?.map(({ label, route }) => (
              <li
                className={`${navStyles.nav_right} ${navStyles.nav_left} ${
                  pathname === route ? navStyles.active : ""
                }`}
              >
                <Link className={navStyles.nav_item + " " + navStyles.a} href="#">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <span className={navStyles.span}>{" AI tool "}<span className={navStyles.pill}><Image src={add} alt="My SVG" width={20} height={20} />ChatGPT</span></span>
          <span className={navStyles.span}>{" Model "}
          <select value={model} onChange={selectModel} className={navStyles.select}>
            {modelTypes?.map((model) => (
              <option>{model}</option>
            ))}
          </select></span>
          <span className={navStyles.span}>Auto Speak <input value = {autoSpeak} type = "checkbox" onChange = {handleCheck} /></span>
          
        </nav>
        
        <div className={navStyles.chatsection}>
          {prompts?.map((prompt) => (
            <div
              className={
                styles.container +
                " " +
                (prompt?.role === "user" ? styles.darker : styles.lighter)
              }
            >
              {prompt?.role !== "user" &&  <i>
                {isSpeaking ? (
                <Image src={pause} alt="My SVG" width={10} height={10} onClick={stopSpeak}/>
              ) : (
                <Image src={play} alt="My SVG" width={10} height={10} onClick={() => speak(prompt.content)}/>
              )}
                </i>}
              <p>{prompt?.content}</p>
            </div>
          ))}
        </div>

        <form className={styles.form}>
        <button
            className={styles.listen}
            onClick={isListening ? onStop : onStart}
          >
            {isListening ? (
              <Image src={svgMicOn} alt="My SVG" width={20} height={20} />
            ) : (
              <Image src={svgMicOff} alt="My SVG" width={20} height={20} />
            )}
          </button>
          &nbsp;
          <button className={styles.listen} onClick={onReset}>
            RESET
          </button>
          &nbsp;
          <input
            type="search"
            value={text || transcript}
            onChange={handleChange}
            className={styles.form__field}
            onKeyDown={handleKeyPress}
          />
          <Image
            src={svgSend}
            width={20}
            height={20}
              style={{marginRight: "2rem"}}
            onClick={handleSubmit}
          ></Image>        </form>
    </section>
  );
}