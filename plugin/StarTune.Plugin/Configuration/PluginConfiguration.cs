using MediaBrowser.Model.Plugins;

namespace StarTune.Plugin.Configuration;

public sealed class PluginConfiguration : BasePluginConfiguration
{
    public bool EnableScheduledRefresh { get; set; } = true;
}
