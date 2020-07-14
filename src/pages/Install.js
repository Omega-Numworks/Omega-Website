import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import ImgCalculatorBody from '../img/calculator-body.png'
import ImgCalculatorBodyOmega from '../img/calculator-body-omega.png'
import ImgCalculatorBodyEpsilon from '../img/calculator-body-epsilon.png'
import ImgCalculatorCable from '../img/calculator-cable.png'

import Installer from '../dfu/installer'

const LANG_TO_FLAGS = {
    "en": "🇺🇸",
    "fr": "🇫🇷",
    "nl": "🇳🇱",
    "pt": "🇵🇹",
    "it": "🇮🇹",
    "de": "🇩🇪",
    "es": "🇪🇸",
    "hu": "🇭🇺"
};

export default class Install extends Component {
    constructor(props) {
        super(props);

        this.state = {
            calculatorDetected: false,
            showTags: false,
            installerNotCompatibleWithThisBrowser: false,
            model: "nXXXX",
            username: <FormattedMessage id="installer.someone" defaultMessage="Someone" />,
            omegaVersion: "N/A",
            epsilonVersion: "N/A",
            installVersion: this.props.match.params.version,
            install: false,
            progressPercentage: 0,
            installationFinished: false,
            error: false,
            errorMessage: "",
            installerInstance: new Installer(this),
            showPopup: false,
            multiLangSupport: false,
            langsList: [],
            selectedLang: ''
        }

        document.title = "Omega — Install"
        
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.detectCalculator = this.detectCalculator.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);

        // Detection
        this.calculatorDetected = this.calculatorDetected.bind(this);
        this.calculatorConnectionLost = this.calculatorConnectionLost.bind(this);
        
        // Errors
        this.calculatorError = this.calculatorError.bind(this);
        this.firmwareNotFound = this.firmwareNotFound.bind(this);

        // Install
        this.showPopup = this.showPopup.bind(this);
        this.hidePopup = this.hidePopup.bind(this);
        this.install = this.install.bind(this);
        this.setFirmwareLanguage = this.setFirmwareLanguage.bind(this);
        this.disableLanguage = this.disableLanguage.bind(this);
        this.setLangsList = this.setLangsList.bind(this);
        this.setProgressPercentage = this.setProgressPercentage.bind(this);
        this.installationFinished = this.installationFinished.bind(this);
        
        // Tags
        this.showTags = this.showTags.bind(this);
        this.hideTags = this.hideTags.bind(this);
        this.toggleTags = this.toggleTags.bind(this);
        
        // Set tags
        this.setUsername = this.setUsername.bind(this);
        this.setModel = this.setModel.bind(this);
        this.setOmegaVersion = this.setOmegaVersion.bind(this);
        this.setEpsilonVersion = this.setEpsilonVersion.bind(this);

        // Browser compatibility
        this.installerNotCompatibleWithThisBrowser = this.installerNotCompatibleWithThisBrowser.bind(this);
    }
    
    disableLanguage() {
        this.setState({langsList: [], multiLangSupport: false, selectedLang: ''});
    }
    
    setLangsList(list) {
        this.setState({langsList: list, multiLangSupport: true, selectedLang: list[0]});
    }
    
    componentDidMount() {
        this.state.installerInstance.init(this.props.match.params.version);
    }
    
    componentDidUpdate() {
        if (this.props.match.params.version !== this.state.installVersion) {
            this.setState({
                installVersion: this.props.match.params.version,
                installerInstance: new Installer(this)
            });
            
            this.state.installerInstance.init(this.props.match.params.version);
        }
    }
    
    componentWillUnmount() {
        this.state.installerInstance.calculator.stopAutoConnect();
    }
    
    firmwareNotFound(version) {
        this.calculatorError(true, <FormattedMessage id="installer.unknown-version" defaultMessage="Firmware version {version} doesn't exist!" values={{version: version}} />);
    }
    
    detectCalculator() {
        this.state.installerInstance.detect();
    }

    // Detection
    calculatorDetected(osDetected) {
        this.setState({
            calculatorDetected: true,
            osDetected: osDetected,
            install: false
        })
        this.showTags();
    }

    calculatorConnectionLost() {
        this.setState({
            calculatorDetected: false,
            osDetected: "",
            install: false
        })
        this.hideTags();
    }
    
    calculatorError(state, message) {
        /*global USBConnectionEvent*/
        if (typeof USBConnectionEvent !== "undefined") {
            if (message instanceof USBConnectionEvent) {
                if (message.type === "disconnect") {
                    message = <FormattedMessage id="installer.unpluged" defaultMessage="The calculator has been disconnected." />;
                }
            } else if (message instanceof DOMException) {
                message = message.message;
            }
        }
    
        this.setState({
            error: state,
            errorMessage: message === null ? "" : message.toString()
        })
        this.calculatorConnectionLost();
        this.hideTags();
    }

    // Install
    install() {
        this.setState({
            install: true,
            osDetected: "",
            progressPercentage: 0,
            installationFinished: false
        });
        
        this.hidePopup();
        if (this.state.multiLangSupport) {
            this.state.installerInstance.install(this.state.selectedLang);
        } else {
            this.state.installerInstance.install(null);
        }
    }

    setFirmwareLanguage(language) {
        this.setState({ selectedLang: language });
    }

    setProgressPercentage(percentage) {
        this.setState({ progressPercentage: percentage });
    }

    installationFinished() {
        this.setState({
            install: false,
            osDetected: "omega",
            installationFinished: true
        });
    }

    // Tags
    showPopup() { this.setState({ showPopup: true }) }
    hidePopup() { this.setState({ showPopup: false }) }
    showTags() { this.setState({ showTags: true }) }
    hideTags() { this.setState({ showTags: false }) }
    toggleTags() { this.setState({ showTags: !this.state.showTags }) }

    // Set tags
    setUsername(username) { this.setState({ username: username }) }
    setModel(model) { this.setState({ model: model }) }
    setOmegaVersion(version) { this.setState({ omegaVersion: version }) }
    setEpsilonVersion(version) { this.setState({ epsilonVersion: version }) }

    // Browser not compatible
    installerNotCompatibleWithThisBrowser() { this.setState({ installerNotCompatibleWithThisBrowser: true }) }

    render() {
        var langs_list_html = [];
        
        for (let lang in this.state.langsList) {
            langs_list_html.push(
                <div onClick={() => this.setFirmwareLanguage(this.state.langsList[lang])}
                     className={"installer__content__language__subbutton " + (this.state.langsList[lang] === this.state.selectedLang ? "installer__content__language__subbutton-active" : "")}>
                     {this.state.langsList[lang].toUpperCase() + " " + LANG_TO_FLAGS[this.state.langsList[lang]]}
                </div>);
        }

        return (
            <div className="content">
                <div className={"installer " + (this.state.installerNotCompatibleWithThisBrowser ? "" : "installer-active")}>
                    <div className="installer__calculator">
                        <img className={"installer__calculator__cable " + (this.state.calculatorDetected ? "installer__calculator__cable-active" : "")} src={ImgCalculatorCable} alt="Calculator Cable"></img>
                        <img className="installer__calculator__body installer__calculator__body-active" src={ImgCalculatorBody} alt="Calculator Body"></img>
                        <img className={"installer__calculator__body " + (this.state.osDetected === "omega" ? "installer__calculator__body-active" : "")} src={ImgCalculatorBodyOmega} alt="Calculator Body"></img>
                        <img className={"installer__calculator__body " + (this.state.osDetected === "epsilon" ? "installer__calculator__body-active" : "")} src={ImgCalculatorBodyEpsilon} alt="Calculator Body"></img>
                    </div>
                    <div className="installer__content">
                        <div className="installer__content__name">{this.state.showTags ? <FormattedMessage id="installer.owner" defaultMessage="{name}'s Numworks" values={{name: this.state.username}} /> : <FormattedMessage id="installer.title" defaultMessage="Omega Installer" />}</div>
                        <div className={"installer__content__tag installer__content__tag-gray " + (this.state.showTags ? "installer__content__tag-active" : "")}>{this.state.model}</div>
                        <div className={"installer__content__tag installer__content__tag-red " + (this.state.showTags && !this.state.install ? "installer__content__tag-active" : "")}>‎Ω {this.state.omegaVersion}</div>
                        <div className={"installer__content__tag installer__content__tag-yellow " + (this.state.showTags && !this.state.install ? "installer__content__tag-active" : "")}>‎E {this.state.epsilonVersion}</div>
                        <div className={"installer__content__progress " + (this.state.install ? "installer__content__progress-active" : "")}>
                            <div className="installer__content__progress__bar" style={{ width: this.state.progressPercentage + "%" }}></div>
                        </div>
                        <div className={"installer__content__progress__message " +  (this.state.install ? "installer__content__progress__message-active" : "")}><FormattedMessage id="installer.installing" defaultMessage="Installing Omega {version}. Please do not unplug your Numworks." values={{version: this.state.installerInstance.toInstall}} /></div>
                        <div className={"installer__content__error " +  (this.state.error ? "installer__content__error-active" : "")}>{this.state.errorMessage}</div>
                        <button onClick={() => this.detectCalculator()} className={"installer__content__button " +  (!this.state.calculatorDetected ? "installer__content__button-active" : "")}><FormattedMessage id="installer.detect" defaultMessage="DETECT CALCULATOR" /></button>
                        <button onClick={this.install} className={"installer__content__button" + ((this.state.calculatorDetected && !this.state.install && !this.state.installationFinished) ? " installer__content__button-active" : "") + (this.state.showPopup ? " installer__content__button-disabled" : "")}><FormattedMessage id="installer.install" defaultMessage="INSTALL OMEGA" /></button>
                        <div  className={"installer__content__language " + ((this.state.calculatorDetected && !this.state.install && !this.state.installationFinished) ? " installer__content__language-active" : "")}>
                            {langs_list_html}
                        </div>
                    </div>
                </div>

                <div className={"popup " + (this.state.showPopup ? "popup-active" : "")}>
                    <FormattedMessage id="installer.disclaimer" defaultMessage="Omega is a redistribution of Epsilon that adds various features to it. We spend a lot of time trying to comply with exam guidelines from different countries. The software is therefore theoretically authorized for examination; however, Omega has not applied for certification by any organization. By clicking on I agree, you accept that neither Omega nor NumWorks can be held responsible in the event of a problem with this software." />
                    <button onClick={this.install} className="popup__button popup__button-active"><FormattedMessage id="installer.agree" defaultMessage="I AGREE" /></button>
                </div>

                <div className={"installer-thanks " + (this.state.installationFinished ? "installer-thanks-active" : "")}>
                    <FormattedMessage id="installer.thanks" defaultMessage="Thank you for installing Omega! Your calculator is now running Omega {version}." values={{version: this.state.omegaVersion}} />
                </div>

                <div className={"installer-notcompatible " + (this.state.installerNotCompatibleWithThisBrowser ? "installer-notcompatible-active" : "")}>
                    <span role="img" aria-label="emoji" className="installer-notcompatible__emoji">😕</span>
                    <FormattedMessage id="installer.incompatible" defaultMessage="Our installer is not compatible with your browser. Please use a browser like Chromium/Google Chrome or Edge." />
                </div>
            </div>
        )
    }
}
