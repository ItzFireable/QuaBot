const QUAVER_REPOSITORY_URL = "https://github.com/Quaver/Quaver";
const RELEASES_URL = "https://github.com/Quaver/Quaver/releases";
const ALL_RANKED_MAPS_URL = "https://rhythmgamers.net/pack/";
const JANKO_SKIN_REPO_URL = "https://gist.github.com/Janko5/d9b659122607a59a36879cd3d2b877ac";
const OSU_SKIN_CONVERTER_URL = "https://gitlab.com/Adri-/quaverskinconverter#changelog";

exports.prompts = {
    en: {
        "playoffline": [
            "Quaver is still in closed alpha stage and not yet publicly released. However, you can download a test client without the online features from GitHub:",
            RELEASES_URL,
            "",
            "**Note: You must have Steam open in order to run the game.**"],
        "features": [
            "If you want to request new features for the game, you can do so by making an issue on GitHub:",
            QUAVER_REPOSITORY_URL
        ],
        "issues": [
            "If you're having issues with the game, you can report them on GitHub:",
            QUAVER_REPOSITORY_URL
        ],
        "mapCommand": [
            "You can download pack of all the ranked maps by following this link:",
            ALL_RANKED_MAPS_URL,
            "",
            "Import them by dragging the files into the game window."
        ],
        "db": ["Quaver also supports .osz, .sm and .mc files. To import them, drag them into the game window."],
        "othergames": [
            "You can directly import maps from other installed games to Quaver without additional downloading.",
            "Simply click '*Detect Songs From Other Installed Games*' setting in the options menu"
        ],
        "skins": [
            "You can browse some of the skins made by the community at the following link:",
            JANKO_SKIN_REPO_URL,
            "",
            "You can also get 'osu! to Quaver' skin converter from the following link:",
            OSU_SKIN_CONVERTER_URL
        ],
        "offtopic": ["Please keep all non-Quaver discussion in <#470728060354822154>."],
        "login": ["You have to be part of alpha testing group to be able to login."]
    }
}
