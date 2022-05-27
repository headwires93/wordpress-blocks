// const { MediaUpload} = wp.editor;
const { ServerSideRender } = wp.editor;
const { Component, Fragment } = wp.element;
const { InspectorControls, BlockControls, AlignmentToolbar, MediaUpload } = wp.blockEditor;
const { registerBlockType } = wp.blocks;
const { ComboboxControl, Button, ExternalLink, TextControl, TextareaControl, ToggleControl, PanelBody, PanelRow, SelectControl, Toolbar, ToolbarButton, Placeholder} = wp.components;
const { withSelect, select } = wp.data;
const { withState } = wp.compose;

//import './style.scss';
//import './editor.scss';



class cardBlockEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode:true
        }
    }

    getInspectorControls = () => {
        const { attributes, setAttributes,  className } = this.props;

		let choices = [
			{value: '0', label: 'Select Link Type'},
            {value: 'page_link', label: 'Page Link'},
            {value: 'file_download', label: 'File Download'},
            {value: 'ext_link', label: 'External Link'},
            {value: 'no_link', label: 'No Link'}           
        ];
		let image_choices = [
            {value: 'rectangle', label: 'Small Rectangle'},
            {value: 'lrg_rectangle', label: 'Large Rectangle'},
            {value: 'sml_square', label: 'Small Square'},
			{value: 'med_square', label: 'Medium Square'}              
        ];

		let page_choices = [];
        if (this.props.posts) {
            page_choices.push({ value: 0, label: 'Select a page' });
            this.props.posts.forEach(post => {
                page_choices.push({ value: post.id, label: post.title.rendered });
            });
        } else {
            page_choices.push({ value: 0, label: 'Loading...' })
        }
		const { filteredOptions, setFilteredOptions } = withState( page_choices );

		const getFileButton = (openEvent) => {
			if(attributes.fileLink) {
			  return (
				<fragment>
					<TextControl 
					label="File Link"
					value={ attributes.fileLink }
					onChange={(newval) => setAttributes({ fileLink: newval })} />
				<div className="button-container">
				  <Button 
					onClick={ openEvent }
					className="button button-large"
				  >
					Change File
				  </Button>
				</div>
			</fragment>

			  );
			}
			else {
			  return (
				<div className="button-container">
				  <Button 
					onClick={ openEvent }
					className="button button-large"
				  >
					Pick a File
				  </Button>
				</div>
			  );
			}
		  };

        return (
        <InspectorControls>
        <PanelBody
            title="Link Controls"
            initialOpen={true}
        >
            <PanelRow>
				<SelectControl
					label='Link Type'
					options={choices}
					value={attributes.linkType}
					onChange={(newval) => setAttributes({ linkType: newval })}
				/>
            </PanelRow>
				{attributes.linkType === "page_link" && 
                    <PanelRow>
						<ComboboxControl
							label="Select Page"
							value={attributes.pageLink}
							onChange={(newval) => setAttributes({ pageLink: newval })}
							options={page_choices}
							onInputChange={ ( inputValue ) =>
								setFilteredOptions(
									page_choices.filter( ( option ) =>
										option.label
											.toLowerCase()
											.startsWith( inputValue.toLowerCase() )
									)
								)
							}
						/>
                    </PanelRow>
                }
				{attributes.linkType === "file_download" && 
                    <PanelRow>

					<MediaUpload
						onSelect={ media => { setAttributes({fileLink: media.url }); } }
						type="application/pdf"
						value={ attributes.fileLink }
						render={ ({ open }) => getFileButton(open) }
					/>	
                    </PanelRow>
                }
				{attributes.linkType === "ext_link" && 
					<PanelRow>
						<TextControl 
							label="URL"
							value={attributes.externalLink}
							onChange={(newtext) => setAttributes({externalLink: newtext})} />
					</PanelRow>
                }
				{attributes.linkType !== "no_link" && 
					<PanelRow>
						<ToggleControl
							label="Show Button?"
							checked={attributes.showbutton}
							onChange={(newval) => setAttributes({ showbutton: newval })}
						/>
					</PanelRow>
				}
				{attributes.showbutton && attributes.linkType !== "no_link" && 
					<TextControl
						onChange={ content => setAttributes({ buttonText: content }) }
						value={ attributes.buttonText }
					/>
				}


            
            </PanelBody>
			<PanelBody
				title="Image Controls"
				initialOpen={true}
        	>
            <PanelRow>
				<SelectControl
					label='Image Size'
					options={image_choices}
					value={attributes.imgSize}
					onChange={(newval) => setAttributes({ imgSize: newval })}
				/>
            </PanelRow>		
            </PanelBody>
        </InspectorControls>
        );
    }
	getBlockControls = () => {
        const { attributes, setAttributes } = this.props;
        return (
            <BlockControls>
            <AlignmentToolbar
                value={attributes.textAlignment}
                onChange={(newalign) => setAttributes({ textAlignment: newalign })}
            />
			<Toolbar label="Preview">
                <ToolbarButton
                    label={this.state.editMode ? "Preview" : "edit" }
                    icon={ this.state.editMode ? "format-image" : "edit" }
                    className="my-custom-button"
                    onClick={() => this.setState({ editMode: !this.state.editMode })}
                />
            </Toolbar>
        </BlockControls>
        );
    }
   

 
    render() {
		const { attributes, setAttributes, className } = this.props;
		const alignmentClass = (attributes.textAlignment != null) ? 'has-text-align-' + attributes.textAlignment : '';
		const getImageButton = (openEvent) => {
			if(attributes.imageUrl) {
			  return (
				<img 
				  src={ attributes.imageUrl }
				  onClick={ openEvent }
				  className="image"
				/>
			  );
			}
			else {
			  return (
				<div className="button-container">
				  <Button 
					onClick={ openEvent }
					className="button button-large"
				  >
					Pick an image
				  </Button>
				</div>
			  );
			}
		  };
		return ([
			this.getInspectorControls(),
			this.getBlockControls(),
			<div className={alignmentClass + " jch_card"}>
				{this.state.editMode &&
					<Fragment>
							<div className="image_container imgfix">
								<MediaUpload
									onSelect={ media => { setAttributes({ imageAlt: media.alt, imageUrl: media.url }); } }
									type="image"
									value={ attributes.imageID }
									render={ ({ open }) => getImageButton(open) }
								/>
							</div>
							<div className = "card__content">
								<TextControl
									onChange={ content => setAttributes({ title: content }) }
									value={ attributes.title }
									placeholder="Your card title"
									className="heading"
								/>
								<TextareaControl
									onChange={ content => setAttributes({ body: content }) }
									value={ attributes.body }
									placeholder="Your card text"
								/>

							</div>
					</Fragment>}

				{!this.state.editMode &&
					<ServerSideRender
						block={this.props.name}
						attributes={{ 
							title: attributes.title,
							body: attributes.body,
							imageAlt: attributes.imageAlt,
							imageUrl: attributes.imageUrl,
							linkType: attributes.linkType,
							pageLink: attributes.pageLink,
							fileLink: attributes.fileLink,
							externalLink: attributes.externalLink,
							showbutton: attributes.showbutton,
							buttonText: attributes.buttonText,
							textAlignment: attributes.textAlignment

						}}
				/>
				}
			</div>
		]);
	  }
}

registerBlockType('jch/cardblock', {   
	title: 'Card',
	icon: 'carrot',
	category: 'common',
	attributes: {
		title: {
			type: 'string',
		},
		body: {
		  	type: 'string',
		},
		imageAlt: {
		  attribute: 'alt'
		},
		imageUrl: {
		  attribute: 'src'
		},
		linkType: {
			type: 'string',
		},
		pageLink: {
			type: 'string'
		},
		fileLink: {
			attribute: 'src'
			
		},
		externalLink: {
			type: 'string'
		},
		showbutton: {
			type: 'boolean',
			default: false
		},
		
		buttonText: {
			type: 'string',
			default: 'Read More'
		},
		imgSize: {
			type: 'string',
			default: 'rectangle'
		},
		textAlignment: {
            type: 'string',
        },
	  },
	  edit:  withSelect(select => {
        const currentPostId = select('core/editor').getCurrentPostId();
        const query = {
            per_page: -1,
            exclude: currentPostId
        }
        return {
            posts: select('core').getEntityRecords('postType', 'page', query)
        }
    })(cardBlockEdit),
	  save: () => { return null } 
  });