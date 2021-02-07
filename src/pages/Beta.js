import React, { Component } from 'react'
import ReleaseCard from '../components/releasecard/ReleaseCard'
import { Button, ButtonsGroup } from '@quentinguidee/react-jade-ui'
import { FormattedMessage } from 'react-intl'

export const releases = {
	"firmwares": [{
	    "name": "O1.21.β1-E15",
	    "commit": "76db361cdeb2997a4aa0af41378d420265cde372",
	    "changelog": [
			"Update: Updated to Epsilon 15.3.1!",
			"New: Real-time clock in the toolbar",
			"Change: Chrome Popup: change URL from workshop.numworks.com to getomega.dev",
			"Change: Doxygen with an Omega theme",
			"Change: Merge omega-themes submodule in the main repository",
			"Fix: Better Spanish translations",
			"Fix: Fixed append implementation"
	    ],
		"compatibility": {
			"N0110": true,
			"N0100": true,
			"web": true,
			"android": false,
			"3ds": false
		},
		"available": true,
		"langages": {
		    "0100": [
		        "en", "fr"
		    ]
		}
	}]
}

export default class Beta extends Component {
	constructor(props) {
		super(props);

		this.state = {
			input: "",
			fieldCompleted: false,
		};

		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
		const value = e.target.value
		this.setState({ input: value });
		if (value.toLowerCase() === "je suis d'accord et ne me rendrai jamais en examen avec une beta" ||
			value.toLowerCase() === "je suis d'accord et ne me rendrai jamais en examen avec une bêta" ||
			value.toLowerCase() === "i agree and will never go to exam with a beta") {
			this.setState({ fieldCompleted: true });
		} else {
			this.setState({ fieldCompleted: false });
		}
	}

    render() {
        return (
            <div className="content">
                <div className="releases__banner">
                    <div className="releases__banner__title">Omega 1.21</div>
                    <div className="releases__banner__description">
						<FormattedMessage defaultMessage="Welcome to the Omega beta program." id="beta.welcome" />
					</div>
                    <ButtonsGroup style={{ display: "inline-block" }}>
                        <Button href="https://github.com/Omega-Numworks/Omega/issues/new?assignees=&labels=Status%3A+Triage%2C+Type%3A+Bug&template=omega-beta-only---bug-report.md&title=%5BBETA-1.21%5D+…" leftIcon="web"><FormattedMessage defaultMessage="REPORT A BUG ON GITHUB" id="beta.report.github"/></Button>
                        <Button href="mailto:getomega.pro@gmail.com" leftIcon="mail"><FormattedMessage defaultMessage="REPORT A BUG BY MAIL" id="beta.report.mail"/></Button>
                    </ButtonsGroup>
                </div>
                <div style={ { height: "16px" } }></div>
                <div className="releases__cards">
                    <div className="releases__warning"><FormattedMessage defaultMessage="Warning: Omega betas are NOT made for exam and do not have Omega exam mode. By going with for exams, you put yourself in danger and risk several years of prohibition of exams. May be even more serious depending on the applicable legislation in your country. By installing an Omega beta, you agree that neither NumWorks nor Omega can be held responsible for any issues with exam mode. If you agree to this, type this sentence in the following field: I agree and will never go to exam with a beta" id="beta.report.exammode"/>
					</div>
					<input className="releases__warning__field" type="text" value={this.state.input} onChange={this.onChange}></input>
                    <ReleaseCard version={releases.firmwares[0]} name="Beta 1" hidden={!this.state.fieldCompleted} />
                </div>
                <div style={ { height: "16px" } }></div>
            </div>
        )
    }
}
