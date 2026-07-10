using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Serialization;
using StarTune.Plugin.Configuration;

namespace StarTune.Plugin;

public sealed class Plugin : BasePlugin<PluginConfiguration>
{
    public static readonly Guid PluginId =
        Guid.Parse("8e4a2c76-f5ab-4c89-95ea-610cc6923f63");

    public Plugin(IApplicationPaths applicationPaths, IXmlSerializer xmlSerializer)
        : base(applicationPaths, xmlSerializer)
    {
        Instance = this;
    }

    public static Plugin? Instance { get; private set; }

    public override string Name => "StarTune";

    public override string Description =>
        "Music ratings and smart playlists for Jellyfin.";

    public override Guid Id => PluginId;
}
