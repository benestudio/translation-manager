# Translation manager

As we wrote in [this article](https://benestudio.co/internationalize-your-react-app-with-react-intl/), the easiest way to deal with internationalization in React is by extracting messages. However you shouldn’t stop there. If you would like to manage the translations online instead of modifying the JSON files, there is a solution for you.

This application has an admin page which can be attached to any application’s admin page with some customization. It has 2 functional pages, where you can manage the languages and the messages, and a page to try out the results.
## Languages management
As you can see in the src/extractMessages.js, instead of English we store the default messages without categorizing it to any language. On this page you can add languages to your application, which will be available somewhere on the site.
## Messages management
On this page you can manage the messages by translating them, adding description, screenshot or widget category. If there is no translation for a language, it will be substituted with the default message so the english column can be mostly unfilled.
### Adding messages
There are 2 ways to add new messages. You can use the new message button (not recommended), or use the register-messages command. The last will extract the messages from the code and register them in the database. To do this, the server must be up and running (using MongoDB locally).
## Refreshing the messages
When the server starts, it gets the messages from the database, fills the JSON files with them and places them in the public folder. You can also do it manually after you have changed a message by clicking on the refresh messages button or you can make your solution to refresh the JSONs at each message edition.
## Demo page
You can check how it is working on the demo page. You can change the language and the new message JSON will be downloaded.
## Best practices and more
### Reuse IntlProvider for multiple repositories
If you have microservices, you can create your own IntlProvider in a util package and use it in all microservice. The current locale can be transferred through the script tag and also listened to language changes. This way you should also distribute the JSON between the widgets.

```
class AppLoader extends Component<IProps> {
 public script?: HTMLScriptElement;
 
 public componentDidMount() {
   this.script = document.createElement("script");
   const { src, id, language } = this.props;
   this.script.setAttribute("appId", id);
   this.script.setAttribute("initialLanguage", language);
   this.script.src = src;
   this.script.async = true;
 
   document.body.appendChild(this.script);
 }
 
 public componentWillUnmount() {
   if (this.script) {
     this.script.remove();
   }
 }
 
 public render() {
   const { id } = this.props;
 
   return (
     <>
       <div className="app-loader" id={id} />
     </>
   );
 }
}
```

```
import React, { useCallback, useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { onLanguageChange } from "../../handlers";
 
import { IProps } from "./interfaces";
 
const script = document.currentScript!;
 
const getLanguage = (): string => {
 return script.getAttribute("initialLanguage") || "en";
};
 
const getMessageFolder = (): string => {
 const path = script.getAttribute("src")!;
 return `${path.slice(0, path.indexOf("bundle.js") - 1)}/messages`;
};
 
const Provider = ({ children }: IProps) => {
 const [locale, setLocale] = useState<string>(getLanguage());
 const defaultLocale = "en";
 const [messages, setMessages] = useState<{[id: string]: string} | null>(null);
 const getMessages = async (newLocale: string) => {
   const result = await fetch(`${getMessageFolder()}/${newLocale}.json`);
   if (result.ok) {
     const contentType = result.headers.get("content-type") || "";
     if (contentType.includes("application/json")) {
       const newMessages = await result.json();
       setMessages(newMessages);
       return;
     }
   }
   setMessages({});
 };
 const handleLanguageChange = useCallback(
   newLocale => {
     setLocale(newLocale);
     getMessages(newLocale);
   },
   [setLocale],
 );
 useEffect(() => {
   const languageChangeListener = onLanguageChange(handleLanguageChange);
   getMessages(locale);
   return () => {
     languageChangeListener.remove();
   };
 }, [handleLanguageChange]);
 if (messages === null) {
   return null;
 }
 return React.createElement(IntlProvider, {
   locale: locale,
   defaultLocale: defaultLocale,
   messages: messages
 }, children);
};
 
export default Provider;
```

### Show children of IntlProvider after the messages are downloaded
To prevent showing the default messages while the JSON file is loading (especially for the non default languages) it can be a good practice to hide the children of the IntlProvider during loading. If you use server-side rendering, the content will be visible from the server-side during the loading and this way you shouldn’t hidrate the app before the messages are loaded.
### Export, import CSV for translators
