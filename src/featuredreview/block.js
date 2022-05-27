const { registerBlockType } = wp.blocks;
const { Component, Fragment } = wp.element;
const { InspectorControls, BlockControls, AlignmentToolbar } = wp.blockEditor;
const { ServerSideRender } = wp.editor;
const { TextControl, ToggleControl, PanelBody, PanelRow, CheckboxControl, SelectControl, Toolbar, ToolbarButton, Placeholder, Disabled } = wp.components;
const { withSelect, select } = wp.data;
 
class FeaturedReviewBlockEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode:true
        }
    }

    getInspectorControls = () => {
        const { attributes, setAttributes } = this.props;
        return (
        <InspectorControls>
        <PanelBody
            title="Button Controls"
            initialOpen={true}
        >
            <PanelRow>
                <ToggleControl
                    label="Show Button?"
                    checked={attributes.showArchiveButton}
                    onChange={(newval) => setAttributes({ showArchiveButton: newval })}
                />
            </PanelRow>
            {attributes.showArchiveButton && 
                <PanelRow>
                    <TextControl 
                        value={attributes.buttonText}
                        onChange={(newtext) => setAttributes({buttonText: newtext})} />
                </PanelRow>
                }
            </PanelBody>
            <PanelBody
            title="Review Type"
            initialOpen={true}
        >
            <PanelRow>
            <SelectControl
                label='Featured or Latest?'
                options={[{ value: 'latest', label:'Latest Review'}, { value: 'featured', label: 'Featured Review' }]}
                value={attributes.featuredOrLatest}
                onChange={(newval) => setAttributes({ featuredOrLatest: newval })}
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
        const { attributes, setAttributes } = this.props;
        let choices = [];
        if (this.props.posts) {
            choices.push({ value: 0, label: 'Select a Review' });
            this.props.posts.forEach(post => {
                choices.push({ value: post.id, label: post.title.rendered });
            });
        } else {
            choices.push({ value: 0, label: 'Loading...' })
        }
 
        return ([
            this.getInspectorControls(),
            this.getBlockControls(),
            <div>
                {this.state.editMode && attributes.featuredOrLatest == 'featured' &&
                <Fragment>
                            <SelectControl
                                label='Select a Review'
                                options={choices}
                                value={attributes.selectedPostId}
                                onChange={(newval) => setAttributes({ selectedPostId: parseInt(newval) })}
                            />
                </Fragment>}

                {attributes.featuredOrLatest == 'latest' &&
                		<ServerSideRender
                            block={this.props.name}
                            attributes={{ 
                                selectedPostId: attributes.selectedPostId,
                                showArchiveButton: attributes.showArchiveButton,
                                buttonText: attributes.buttonText,
                                featuredOrLatest: attributes.featuredOrLatest
                            }}
                    />
                }

                {!this.state.editMode &&
                		<ServerSideRender
                            block={this.props.name}
                            attributes={{ 
                                selectedPostId: attributes.selectedPostId,
                                showArchiveButton: attributes.showArchiveButton,
                                buttonText: attributes.buttonText,
                                featuredOrLatest: attributes.featuredOrLatest
                            }}
                    />
                }
            </div>
        ]);
    }
}

 
registerBlockType('jch/featuredreview', {
    title: 'Featured review',
    category: 'common',
    icon: 'format-quote',
    description: 'Choose a review to feature on the page.',
    keywords: ['Review', 'Testimonial'],
    attributes: {
        featuredOrLatest: {
            type: 'string',
            default: 'latest'
        },
        selectedPostId: {
            type: 'number'
        },
        showArchiveButton: {
            type: 'boolean',
            default: true
        },
        buttonText: {
            type: 'string',
            default: "View More Reviews"
        }
    },
    edit: withSelect(select => {
        const query = {
            per_page: -1,
        }
        return {
            posts: select('core').getEntityRecords('postType', 'reviews', query)
        }
    })(FeaturedReviewBlockEdit),
    save: () => { return null }
});

